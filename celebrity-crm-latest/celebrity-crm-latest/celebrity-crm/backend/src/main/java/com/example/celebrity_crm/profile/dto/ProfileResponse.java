package com.example.celebrity_crm.profile.dto;

public record ProfileResponse(
        String name,
        String email,
        String phone,
        String location,
        String bio,
        String instagram,
        String youtube,
        String imageUrl,
        String roleTitle,
        String managerName,
        String managerPhone) {
}