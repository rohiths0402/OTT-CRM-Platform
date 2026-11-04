package com.example.celebrity_crm.payment.dto;

import jakarta.validation.constraints.Positive;

public record RazorpayOrderRequest(@Positive long amount) {
}