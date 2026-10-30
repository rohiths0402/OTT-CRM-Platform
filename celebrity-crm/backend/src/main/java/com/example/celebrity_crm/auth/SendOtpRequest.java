package com.example.celebrity_crm.auth;

import jakarta.validation.constraints.NotBlank;

public record SendOtpRequest(@NotBlank(message = "Enter your mobile number.") String mobile) {
}