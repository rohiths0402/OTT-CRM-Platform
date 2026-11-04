package com.example.celebrity_crm.schedule.dto;

public record ScheduleResponse(
        Long id,
        String type,
        String title,
        String project,
        String date,
        String callTime,
        String wrapTime,
        String status,
        String statusNote,
        boolean online,
        String location,
        String city,
        String notes,
        String response,
        Offer offer,
        Contact contact,
        Pickup pickup,
        Look look) {

    public record Offer(String company, long advance, long total) {}

    public record Contact(String name, String role, String phone) {}

    public record Pickup(String time, String driver, String vehicle) {}

    public record Look(String wardrobe, String vanity, String makeup) {}
}