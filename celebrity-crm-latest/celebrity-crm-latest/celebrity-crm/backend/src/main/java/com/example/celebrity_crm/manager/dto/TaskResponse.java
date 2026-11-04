package com.example.celebrity_crm.manager.dto;

public record TaskResponse(
        Long id,
        String title,
        String dueDate,
        String assignee,
        boolean done) {
}