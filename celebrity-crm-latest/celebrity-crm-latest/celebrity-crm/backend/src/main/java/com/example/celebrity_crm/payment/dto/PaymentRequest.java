package com.example.celebrity_crm.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record PaymentRequest(
        @NotBlank String payer,
        @Positive long amount,
        @NotBlank @Pattern(regexp = "RECEIVED|PENDING") String status,
        @NotNull LocalDate payDate) {
}