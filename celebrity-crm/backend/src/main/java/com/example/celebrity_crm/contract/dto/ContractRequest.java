package com.example.celebrity_crm.contract.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ContractRequest(
        @NotBlank String title,
        String party,
        LocalDate dueDate) {
}