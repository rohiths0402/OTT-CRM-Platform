package com.example.celebrity_crm.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record SettleRequest(
        @Positive long amount,
        @NotBlank String method,
        @NotBlank String reference) {
}