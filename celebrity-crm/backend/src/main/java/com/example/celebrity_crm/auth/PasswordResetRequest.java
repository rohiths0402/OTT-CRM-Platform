package com.example.celebrity_crm.auth;

import jakarta.validation.constraints.NotBlank;

public record PasswordResetRequest(
        @NotBlank(message = "Start the reset again.") String resetToken,
        @NotBlank(message = "Enter a new password.") String newPassword) {
}