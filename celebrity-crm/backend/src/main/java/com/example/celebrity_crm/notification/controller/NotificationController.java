package com.example.celebrity_crm.notification.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.notification.model.Notification;
import com.example.celebrity_crm.notification.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;
    private final CurrentUser currentUser;

    public NotificationController(NotificationService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<Notification> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PutMapping("/{id}/read")
    public Notification markRead(Authentication authentication, @PathVariable Long id) {
        return service.markRead(currentUser.id(authentication), id);
    }
}