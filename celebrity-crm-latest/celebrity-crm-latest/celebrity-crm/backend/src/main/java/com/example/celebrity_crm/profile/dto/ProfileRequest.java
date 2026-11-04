package com.example.celebrity_crm.profile.dto;

public record ProfileRequest(
        String roleTitle,
        String imageUrl,
        String managerName,
        String managerPhone,
        String name,
        String phone,
        String location,
        String bio,
        String instagram,
        String youtube) {
}