package com.example.celebrity_crm.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;
    private final GoogleClient googleClient;

    public AuthController(AuthService service, GoogleClient googleClient) {
        this.service = service;
        this.googleClient = googleClient;
    }

    @PostMapping("/login")
    public Map<String, UserResponse> login(@Valid @RequestBody LoginRequest body,
                                           HttpServletRequest request, HttpServletResponse response) {
        return Map.of("user", service.login(body.email(), body.password(), request, response));
    }

    @PostMapping("/password/forgot")
    public Map<String, Boolean> forgotPassword(@Valid @RequestBody PasswordForgotRequest body) {
        service.forgotPassword(body.channel(), body.identifier());
        return Map.of("sent", true);
    }

    @PostMapping("/password/verify")
    public Map<String, String> verifyReset(@Valid @RequestBody PasswordVerifyRequest body) {
        String token = service.verifyReset(body.channel(), body.identifier(), body.otp(), body.idToken());
        return Map.of("resetToken", token);
    }

    @PostMapping("/password/reset")
    public Map<String, Boolean> resetPassword(@Valid @RequestBody PasswordResetRequest body) {
        service.resetPassword(body.resetToken(), body.newPassword());
        return Map.of("reset", true);
    }

    @PostMapping("/password/change")
    public Map<String, Boolean> changePassword(@Valid @RequestBody PasswordChangeRequest body,
                                               Authentication authentication) {
        service.changePassword(authentication.getName(), body.currentPassword(), body.newPassword());
        return Map.of("changed", true);
    }

    @PostMapping("/otp/send")
    public Map<String, Boolean> sendOtp(@Valid @RequestBody SendOtpRequest body) {
        service.sendOtp(body.mobile().trim());
        return Map.of("sent", true);
    }

    @PostMapping("/otp/verify")
    public Map<String, UserResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest body,
                                               HttpServletRequest request, HttpServletResponse response) {
        return Map.of("user", service.verifyOtp(body.mobile().trim(), body.otp(), request, response));
    }

    @PostMapping("/otp/firebase")
    public Map<String, UserResponse> firebaseLogin(@Valid @RequestBody FirebaseLoginRequest body,
                                                   HttpServletRequest request, HttpServletResponse response) {
        return Map.of("user", service.loginWithPhone(body.idToken(), request, response));
    }

    @PostMapping("/google")
    public Map<String, UserResponse> google(@Valid @RequestBody GoogleRequest body,
                                            HttpServletRequest request, HttpServletResponse response) {
        String email = googleClient.emailFor(body.code());
        return Map.of("user", service.loginByEmail(email, request, response));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) {
        service.logout(request);
    }

    @GetMapping("/me")
    public Map<String, UserResponse> me(Authentication authentication) {
        return Map.of("user", service.me(authentication.getName()));
    }
}