package com.example.celebrity_crm.analytics.dto;

import java.util.List;

public record AnalyticsResponse(
        long collected,
        long pending,
        long annualTarget,
        long pipelineValue,
        int pipelineCount,
        int activeProjects,
        int upcomingProjects,
        int completedProjects,
        int signedContracts,
        int totalContracts,
        List<DealItem> deals) {

    public record DealItem(
            Long id,
            String brand,
            String campaign,
            long value,
            String status,
            String due,
            String contact,
            String nextStep) {
    }
}