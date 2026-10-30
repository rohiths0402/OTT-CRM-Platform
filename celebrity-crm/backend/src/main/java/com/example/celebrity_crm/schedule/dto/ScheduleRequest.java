package com.example.celebrity_crm.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleRequest(
        @NotBlank String title,
        String scene,
        @NotBlank @Pattern(regexp = "SHOOT|MEETING|PHOTOSHOOT") String type,
        String shift,
        @NotNull LocalDate eventDate,
        LocalTime eventTime,
        String location,
        String vanity,
        String costume) {
}