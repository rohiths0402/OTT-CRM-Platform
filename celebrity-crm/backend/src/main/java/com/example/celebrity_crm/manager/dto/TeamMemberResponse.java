package com.example.celebrity_crm.manager.dto;

public record TeamMemberResponse(
        Long id,
        String name,
        String role,
        String phone,
        String email,
        String focus) {
}