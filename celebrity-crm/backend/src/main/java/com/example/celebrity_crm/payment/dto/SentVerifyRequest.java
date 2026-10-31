package com.example.celebrity_crm.payment.dto;

import jakarta.validation.constraints.NotBlank;

public record SentVerifyRequest(
        @NotBlank String orderId,
        @NotBlank String paymentId,
        @NotBlank String signature,
        @NotBlank String recipient,
        @NotBlank String upiId,
        String note) {
}