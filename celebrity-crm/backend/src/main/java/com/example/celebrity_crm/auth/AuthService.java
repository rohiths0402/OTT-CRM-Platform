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
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
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
    private final SecurityContextRepository contextRepository = new HttpSessionSecurityContextRepository();
    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpCode> otps = new ConcurrentHashMap<>();

    public AuthService(StaffUserRepository users, AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService, FirebaseClient firebase) {
        this.users = users;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.firebase = firebase;
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
}