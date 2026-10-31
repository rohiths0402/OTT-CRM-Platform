package com.example.celebrity_crm.project.dto;

import java.util.List;

public record ProjectResponse(
        Long id,
        String title,
        String type,
        String role,
        String company,
        String director,
        String status,
        String phase,
        int progress,
        String progressLabel,
        String release,
        String nextCall,
        Money money,
        String contract,
        List<Member> team) {

    public record Money(long total, long received, String next) {}

    public record Member(String name, String role, String phone) {}
}