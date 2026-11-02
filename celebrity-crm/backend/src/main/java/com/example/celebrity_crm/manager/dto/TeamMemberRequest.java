package com.example.celebrity_crm.manager.dto;

import jakarta.validation.constraints.NotBlank;

public record TeamMemberRequest(
        @NotBlank String name,
        @NotBlank String role,
        String phone,
        String email,
        String focus) {
}