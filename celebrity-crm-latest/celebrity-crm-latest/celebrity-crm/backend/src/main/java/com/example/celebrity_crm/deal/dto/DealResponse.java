package com.example.celebrity_crm.deal.dto;

public record DealResponse(
        Long id,
        String brand,
        String campaign,
        String category,
        String platform,
        long value,
        String status,
        String deliverables,
        String dueDate,
        String contact,
        String nextStep) {
}