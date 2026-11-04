package com.example.celebrity_crm.contract.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record ContractRequest(
        @NotBlank String title,
        @NotBlank String counterparty,
        @Positive long value,
        String type,
        String terms,
        LocalDate expiry) {
}