package com.example.celebrity_crm.dashboard.controller;

import com.example.celebrity_crm.dashboard.dto.DashboardResponse;
import com.example.celebrity_crm.dashboard.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping
    public DashboardResponse get(Authentication authentication) {
        return service.get(authentication.getName());
    }
}