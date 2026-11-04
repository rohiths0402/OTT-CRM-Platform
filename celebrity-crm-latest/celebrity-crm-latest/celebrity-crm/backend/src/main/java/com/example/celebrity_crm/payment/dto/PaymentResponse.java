package com.example.celebrity_crm.payment.dto;

public record PaymentResponse(
        Long id,
        String project,
        String projectType,
        String payer,
        String kind,
        long amount,
        String status,
        String date,
        String reference,
        String note,
        String method,
        long receivedAmount) {
}