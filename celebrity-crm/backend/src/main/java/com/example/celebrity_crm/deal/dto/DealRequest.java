package com.example.celebrity_crm.deal.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record DealRequest(
        @NotBlank String title,
        String detail,
        LocalDate dueDate) {
}