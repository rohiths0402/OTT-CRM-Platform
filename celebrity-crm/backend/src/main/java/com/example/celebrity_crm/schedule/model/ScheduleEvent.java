package com.example.celebrity_crm.schedule.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedule_events")
public class ScheduleEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String title;
    private String scene;
    private String type;
    private String shift;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String location;
    private String vanity;
    private String costume;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getScene() { return scene; }
    public void setScene(String scene) { this.scene = scene; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public LocalTime getEventTime() { return eventTime; }
    public void setEventTime(LocalTime eventTime) { this.eventTime = eventTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getVanity() { return vanity; }
    public void setVanity(String vanity) { this.vanity = vanity; }
    public String getCostume() { return costume; }
    public void setCostume(String costume) { this.costume = costume; }
}