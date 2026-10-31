package com.example.celebrity_crm.profile.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profile_photos")
public class ProfilePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(columnDefinition = "LONGTEXT")
    private String photo;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
}