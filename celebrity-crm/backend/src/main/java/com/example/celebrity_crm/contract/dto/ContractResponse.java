package com.example.celebrity_crm.contract.dto;

public record ContractResponse(
        Long id,
        String title,
        String counterparty,
        String type,
        String status,
        long value,
        String updated,
        String expiry,
        String terms,
        String action,
        String signedBy,
        String signedAt,
        String signatureData) {
}