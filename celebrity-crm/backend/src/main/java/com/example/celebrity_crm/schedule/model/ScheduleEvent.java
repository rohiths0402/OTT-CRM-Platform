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

    private String type;
    private String title;
    private String projectName;
    private LocalDate eventDate;
    private LocalTime callTime;
    private LocalTime wrapTime;
    private String status;
    private String statusNote;
    private boolean online;
    private String location;
    private String city;

    @Column(length = 500)
    private String notes;

    private String contactName;
    private String contactRole;
    private String contactPhone;

    private LocalTime pickupTime;
    private String pickupDriver;
    private String pickupVehicle;

    private String wardrobe;
    private String vanity;
    private String makeup;

    private String response = "accepted";
    private String company;
    private long advanceAmount;
    private long totalAmount;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public LocalTime getCallTime() { return callTime; }
    public void setCallTime(LocalTime callTime) { this.callTime = callTime; }
    public LocalTime getWrapTime() { return wrapTime; }
    public void setWrapTime(LocalTime wrapTime) { this.wrapTime = wrapTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStatusNote() { return statusNote; }
    public void setStatusNote(String statusNote) { this.statusNote = statusNote; }
    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getContactRole() { return contactRole; }
    public void setContactRole(String contactRole) { this.contactRole = contactRole; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public LocalTime getPickupTime() { return pickupTime; }
    public void setPickupTime(LocalTime pickupTime) { this.pickupTime = pickupTime; }
    public String getPickupDriver() { return pickupDriver; }
    public void setPickupDriver(String pickupDriver) { this.pickupDriver = pickupDriver; }
    public String getPickupVehicle() { return pickupVehicle; }
    public void setPickupVehicle(String pickupVehicle) { this.pickupVehicle = pickupVehicle; }
    public String getWardrobe() { return wardrobe; }
    public void setWardrobe(String wardrobe) { this.wardrobe = wardrobe; }
    public String getVanity() { return vanity; }
    public void setVanity(String vanity) { this.vanity = vanity; }
    public String getMakeup() { return makeup; }
    public void setMakeup(String makeup) { this.makeup = makeup; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public long getAdvanceAmount() { return advanceAmount; }
    public void setAdvanceAmount(long advanceAmount) { this.advanceAmount = advanceAmount; }
    public long getTotalAmount() { return totalAmount; }
    public void setTotalAmount(long totalAmount) { this.totalAmount = totalAmount; }
}