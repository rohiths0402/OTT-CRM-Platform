package com.example.celebrity_crm.payment.dto;

public record RazorpayOrderResponse(String orderId, String keyId, long amount, String currency) {
}