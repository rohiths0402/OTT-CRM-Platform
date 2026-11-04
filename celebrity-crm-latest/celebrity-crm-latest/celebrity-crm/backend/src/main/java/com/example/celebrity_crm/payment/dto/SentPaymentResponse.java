package com.example.celebrity_crm.payment.dto;

public record SentPaymentResponse(
        Long id,
        String recipient,
        String upiId,
        long amount,
        String note,
        String reference,
        String method,
        String date) {
}