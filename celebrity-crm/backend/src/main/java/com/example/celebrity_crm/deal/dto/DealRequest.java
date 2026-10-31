package com.example.celebrity_crm.deal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record DealRequest(
        @NotBlank String brand,
        @NotBlank String campaign,
        @NotBlank String platform,
        @Positive long value,
        String category,
        String deliverables,
        String contact,
        String nextStep,
        LocalDate dueDate) {
}