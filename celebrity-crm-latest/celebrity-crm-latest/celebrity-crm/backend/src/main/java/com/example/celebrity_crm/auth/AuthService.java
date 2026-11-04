package com.example.celebrity_crm.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final int MAX_TRIES = 5;
    private static final int LOCK_MINUTES = 15;

    private final StaffUserRepository users;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final FirebaseClient firebase;
    private final MailClient mail;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository contextRepository = new HttpSessionSecurityContextRepository();
    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpCode> otps = new ConcurrentHashMap<>();
    private final Map<String, OtpCode> resets = new ConcurrentHashMap<>();
    private final Map<String, ResetToken> resetTokens = new ConcurrentHashMap<>();

    public AuthService(StaffUserRepository users, AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService, FirebaseClient firebase,
                       MailClient mail, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.firebase = firebase;
        this.mail = mail;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse login(String emailText, String password,
                              HttpServletRequest request, HttpServletResponse response) {
        String email = emailText.trim().toLowerCase();
        StaffUser user = users.findByEmail(email).orElse(null);

        if (user != null && user.isLocked()) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many wrong attempts. Try again after " + LOCK_MINUTES + " minutes.");
        }

        Authentication auth;
        try {
            auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (AuthenticationException e) {
            if (user != null) {
                wrongPassword(user);
            }
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect.");
        }

        user.setFailedLogins(0);
        user.setLockedUntil(null);
        users.save(user);

        saveSession(auth, request, response);
        return toResponse(user);
    }

    // step 1 of the reset: only real staff users get a code
    public void forgotPassword(String channel, String identifier) {
        StaffUser user = findForReset(channel, identifier);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    isMobile(channel) ? "This mobile number is not registered." : "This email is not registered.");
        }

        // for a mobile number the code is sent by Firebase from the browser
        if (isMobile(channel)) {
            return;
        }

        String code = String.format("%06d", random.nextInt(1000000));
        resets.put(user.getEmail(), new OtpCode(code, LocalDateTime.now().plusMinutes(10)));

        if (!mail.isConfigured()) {
            System.out.println("Mail is not set up. Reset code for " + user.getEmail() + " is " + code);
            return;
        }

        try {
            mail.send(user.getEmail(), "Celebrity CRM password reset",
                    "Your password reset code is " + code + ".\n\n"
                            + "It is valid for 10 minutes. If you did not ask for this, you can ignore this email.");
        } catch (Exception e) {
            resets.remove(user.getEmail());
            System.out.println("Could not send reset email: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Could not send the email. Try again.");
        }
    }

    // step 2: check the code and hand back a short lived reset token
    public String verifyReset(String channel, String identifier, String otp, String idToken) {
        StaffUser user = findForReset(channel, identifier);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "That code is incorrect. Try again.");
        }

        if (isMobile(channel)) {
            String phone = null;
            try {
                phone = firebase.phoneFromToken(idToken);
            } catch (Exception e) {
                System.out.println("Firebase token check failed: " + e.getMessage());
            }
            if (phone == null || !phone.equals("+91" + identifier.trim())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Could not verify the mobile number. Try again.");
            }
        } else {
            OtpCode saved = resets.get(user.getEmail());
            if (saved == null || otp == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "That code is incorrect. Try again.");
            }
            if (saved.expiresAt.isBefore(LocalDateTime.now())) {
                resets.remove(user.getEmail());
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This code has expired. Ask for a new one.");
            }
            if (!saved.code.equals(otp.trim())) {
                saved.tries++;
                if (saved.tries >= MAX_TRIES) {
                    resets.remove(user.getEmail());
                }
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "That code is incorrect. Try again.");
            }
            resets.remove(user.getEmail());
        }

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        resetTokens.put(token, new ResetToken(user.getEmail(), LocalDateTime.now().plusMinutes(15)));
        return token;
    }

    // step 3: set the new password with the reset token
    public void resetPassword(String token, String newPassword) {
        ResetToken saved = resetTokens.get(token);
        if (saved == null || saved.expiresAt.isBefore(LocalDateTime.now())) {
            resetTokens.remove(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This reset has expired. Start again.");
        }

        checkPassword(newPassword);

        StaffUser user = users.findByEmail(saved.email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This reset has expired. Start again."));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setFailedLogins(0);
        user.setLockedUntil(null);
        users.save(user);
        resetTokens.remove(token);
    }

    // for a signed in user
    public void changePassword(String email, String currentPassword, String newPassword) {
        StaffUser user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in again."));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect.");
        }
        if (currentPassword.equals(newPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a password different from the current one.");
        }

        checkPassword(newPassword);

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        users.save(user);
    }

    // login after Firebase has checked the mobile code in the browser
    public UserResponse loginWithPhone(String idToken, HttpServletRequest request, HttpServletResponse response) {
        String phone = null;
        try {
            phone = firebase.phoneFromToken(idToken);
        } catch (Exception e) {
            System.out.println("Firebase token check failed: " + e.getMessage());
        }
        if (phone == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Could not verify the mobile number. Try again.");
        }

        String mobile = phone.startsWith("+91") ? phone.substring(3) : phone;
        StaffUser user = users.findByMobile(mobile).orElse(null);
        if (user == null || !user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This mobile number does not have access.");
        }

        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        Authentication auth = new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
        saveSession(auth, request, response);
        return toResponse(user);
    }

    // login after Google has confirmed the email
    public UserResponse loginByEmail(String emailText, HttpServletRequest request, HttpServletResponse response) {
        StaffUser user = users.findByEmail(emailText.trim().toLowerCase()).orElse(null);
        if (user == null || !user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This Google account does not have access.");
        }

        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        Authentication auth = new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
        saveSession(auth, request, response);
        return toResponse(user);
    }

    // old test code, prints the code in the console
    public void sendOtp(String mobile) {
        StaffUser user = users.findByMobile(mobile).orElse(null);
        if (user == null || !user.isActive()) {
            return;
        }

        String code = String.format("%06d", random.nextInt(1000000));
        otps.put(mobile, new OtpCode(code, LocalDateTime.now().plusMinutes(5)));

        System.out.println("=========== LOGIN OTP ===========");
        System.out.println("Mobile : " + mobile);
        System.out.println("Code   : " + code + " (valid for 5 minutes)");
        System.out.println("=================================");
    }

    public UserResponse verifyOtp(String mobile, String code,
                                  HttpServletRequest request, HttpServletResponse response) {
        OtpCode saved = otps.get(mobile);
        StaffUser user = users.findByMobile(mobile).orElse(null);

        if (saved == null || user == null || !user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "That code is incorrect. Try again.");
        }
        if (saved.expiresAt.isBefore(LocalDateTime.now())) {
            otps.remove(mobile);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This code has expired. Ask for a new one.");
        }
        if (!saved.code.equals(code.trim())) {
            saved.tries++;
            if (saved.tries >= MAX_TRIES) {
                otps.remove(mobile);
            }
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "That code is incorrect. Try again.");
        }

        otps.remove(mobile);

        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        Authentication auth = new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
        saveSession(auth, request, response);
        return toResponse(user);
    }

    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    public UserResponse me(String email) {
        StaffUser user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in again."));
        return toResponse(user);
    }

    private boolean isMobile(String channel) {
        return "MOBILE".equalsIgnoreCase(channel);
    }

    private StaffUser findForReset(String channel, String identifier) {
        StaffUser user = isMobile(channel)
                ? users.findByMobile(identifier.trim()).orElse(null)
                : users.findByEmail(identifier.trim().toLowerCase()).orElse(null);
        return user != null && user.isActive() ? user : null;
    }

    private void checkPassword(String password) {
        if (password.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters.");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must have a capital letter.");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must have a number.");
        }
        if (!password.matches(".*[^A-Za-z0-9\\s].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must have a special character, like @ # $ % !");
        }
    }

    private void saveSession(Authentication auth, HttpServletRequest request, HttpServletResponse response) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        if (request.getSession(false) != null) {
            request.changeSessionId();
        }
        contextRepository.saveContext(context, request, response);
    }

    private void wrongPassword(StaffUser user) {
        int tries = user.getFailedLogins() + 1;
        if (tries >= MAX_TRIES) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
            tries = 0;
        }
        user.setFailedLogins(tries);
        users.save(user);
    }

    private UserResponse toResponse(StaffUser user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    private static class OtpCode {
        String code;
        LocalDateTime expiresAt;
        int tries;

        OtpCode(String code, LocalDateTime expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
        }
    }

    private static class ResetToken {
        String email;
        LocalDateTime expiresAt;

        ResetToken(String email, LocalDateTime expiresAt) {
            this.email = email;
            this.expiresAt = expiresAt;
        }
    }
}