package com.example.celebrity_crm.dashboard.dto;

import java.util.List;

public record DashboardResponse(
        TodayShoot todayShoot,
        Manager manager,
        List<Attention> attention,
        List<Upcoming> upcoming,
        Payments payments,
        List<ProjectItem> projects,
        List<NotificationItem> notifications) {

    public record TodayShoot(String title, String scene, String shift, String callTime,
                             String location, String vanity, String costume) {}

    public record Manager(String name, String phone, String display) {}

    public record Attention(String id, String title, String detail, String tag, String tone, String target) {}

    public record Upcoming(Long id, String day, String month, String title, String place, String time) {}

    public record Payments(long received, long waiting, String next) {}

    public record ProjectItem(Long id, String title, String role, String phase, int progress) {}

    public record NotificationItem(Long id, String title, String desc, String time, boolean read) {}
}