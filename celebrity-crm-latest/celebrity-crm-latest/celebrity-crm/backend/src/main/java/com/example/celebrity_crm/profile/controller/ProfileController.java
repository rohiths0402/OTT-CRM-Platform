package com.example.celebrity_crm.profile.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.profile.dto.ProfileRequest;
import com.example.celebrity_crm.profile.dto.ProfileResponse;
import com.example.celebrity_crm.profile.service.ProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService service;
    private final CurrentUser currentUser;

    public ProfileController(ProfileService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ProfileResponse get(Authentication authentication) {
        return service.get(currentUser.id(authentication));
    }

    @PutMapping
    public ProfileResponse save(Authentication authentication, @RequestBody ProfileRequest request) {
        return service.save(currentUser.id(authentication), request);
    }
}