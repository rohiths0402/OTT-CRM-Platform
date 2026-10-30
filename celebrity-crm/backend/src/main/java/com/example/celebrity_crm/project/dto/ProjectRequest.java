package com.example.celebrity_crm.project.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
        @NotBlank String title,
        String role,
        String phase,
        @Min(0) @Max(100) int progress) {
}