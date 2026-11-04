package com.example.celebrity_crm.auth;

import jakarta.validation.constraints.NotBlank;

public record GoogleRequest(@NotBlank(message = "Google sign in failed. Try again.") String code) {
}