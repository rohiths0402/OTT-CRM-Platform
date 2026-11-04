package com.example.celebrity_crm.manager.dto;

import jakarta.validation.constraints.NotBlank;

public record TaskRequest(
        @NotBlank String title,
        String dueDate,
        String assignee) {
}