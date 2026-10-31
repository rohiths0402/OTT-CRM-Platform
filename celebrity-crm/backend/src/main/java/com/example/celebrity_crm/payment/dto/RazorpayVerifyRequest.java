package com.example.celebrity_crm.payment.dto;

import jakarta.validation.constraints.NotBlank;

public record RazorpayVerifyRequest(
        @NotBlank String orderId,
        @NotBlank String paymentId,
        @NotBlank String signature) {
}