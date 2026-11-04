package com.example.celebrity_crm.auth;

import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(
        @NotBlank(message = "Enter your mobile number.") String mobile,
        @NotBlank(message = "Enter the 6 digit code.") String otp) {
}