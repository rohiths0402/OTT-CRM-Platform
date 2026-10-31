package com.example.celebrity_crm.project.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record ProjectRequest(
        @NotBlank String title,
        String type,
        String role,
        String company,
        String director,
        @NotBlank @Pattern(regexp = "active|upcoming|completed") String status,
        String phase,
        @Min(0) @Max(100) int progress,
        String progressLabel,
        String release,
        Money money,
        @Pattern(regexp = "signed|awaiting|draft") String contract,
        List<Member> team) {

    public record Money(long total, long received, String next) {}

    public record Member(String name, String role, String phone) {}
}