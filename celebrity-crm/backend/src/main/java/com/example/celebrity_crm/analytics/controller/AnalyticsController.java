package com.example.celebrity_crm.analytics.controller;

import com.example.celebrity_crm.analytics.dto.AnalyticsResponse;
import com.example.celebrity_crm.analytics.service.AnalyticsService;
import com.example.celebrity_crm.config.CurrentUser;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService service;
    private final CurrentUser currentUser;

    public AnalyticsController(AnalyticsService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public AnalyticsResponse get(Authentication authentication) {
        return service.get(currentUser.id(authentication));
    }
}