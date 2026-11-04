package com.example.celebrity_crm.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleRequest(
        @NotBlank @Pattern(regexp = "shoot|brand|meeting|press|travel") String type,
        @NotBlank String title,
        String project,
        @NotNull LocalDate date,
        @NotNull LocalTime callTime,
        LocalTime wrapTime,
        @Pattern(regexp = "confirmed|tentative|updated") String status,
        String statusNote,
        boolean online,
        String location,
        String city,
        String notes,
        @Pattern(regexp = "pending|accepted|declined") String response,
        Offer offer,
        Contact contact,
        Pickup pickup,
        Look look) {

    public record Offer(String company, long advance, long total) {}

    public record Contact(String name, String role, String phone) {}

    public record Pickup(LocalTime time, String driver, String vehicle) {}

    public record Look(String wardrobe, String vanity, String makeup) {}
}