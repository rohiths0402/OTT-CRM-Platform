package com.example.celebrity_crm.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record SentPaymentRequest(
        @NotBlank String recipient,
        @NotBlank String upiId,
        @Positive long amount,
        String note,
        @NotBlank String reference) {
}