package com.example.celebrity_crm.contract.dto;

import jakarta.validation.constraints.NotBlank;

public record SignRequest(
        @NotBlank String signer,
        @NotBlank String signatureData) {
}