package com.example.celebrity_crm.auth;

import jakarta.validation.constraints.NotBlank;

public record PasswordVerifyRequest(
        @NotBlank(message = "Choose email or mobile.") String channel,
        @NotBlank(message = "Enter your email or mobile number.") String identifier,
        String otp,
        String idToken) {
}