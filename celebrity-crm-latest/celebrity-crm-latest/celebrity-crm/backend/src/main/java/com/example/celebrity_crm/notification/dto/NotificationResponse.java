package com.example.celebrity_crm.notification.dto;

public record NotificationResponse(
        Long id,
        String title,
        String desc,
        String time,
        boolean read,
        String target) {}