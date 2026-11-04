package com.example.celebrity_crm.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final StaffUserRepository users;
    private final PasswordEncoder encoder;

    @Value("${app.admin.name}")
    private String name;

    @Value("${app.admin.email}")
    private String email;

    @Value("${app.admin.password}")
    private String password;

    @Value("${app.admin.mobile:}")
    private String mobile;

    public AdminSeeder(StaffUserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() > 0) {
            return;
        }
        StaffUser admin = new StaffUser();
        admin.setName(name);
        admin.setEmail(email.trim().toLowerCase());
        if (!mobile.isBlank()) {
            admin.setMobile(mobile.trim());
        }
        admin.setPasswordHash(encoder.encode(password));
        admin.setRole("ADMIN");
        users.save(admin);
        System.out.println("First admin created: " + admin.getEmail());
    }
}