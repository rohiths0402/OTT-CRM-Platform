package com.example.celebrity_crm.auth;

import jakarta.validation.constraints.NotBlank;

public record PasswordForgotRequest(
        @NotBlank(message = "Enter your email or mobile number.") String identifier,
        @NotBlank(message = "Choose email or mobile.") String channel) {
}