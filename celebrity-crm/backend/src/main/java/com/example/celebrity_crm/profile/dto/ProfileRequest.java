package com.example.celebrity_crm.profile.dto;

public record ProfileRequest(
        String roleTitle,
        String imageUrl,
        String managerName,
        String managerPhone) {
}