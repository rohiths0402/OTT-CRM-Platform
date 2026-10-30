package com.example.celebrity_crm.notification.service;

import com.example.celebrity_crm.notification.model.Notification;
import com.example.celebrity_crm.notification.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public List<Notification> list(Long userId) {
        return repository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification markRead(Long userId, Long id) {
        Notification notification = repository.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));
        notification.setSeen(true);
        return repository.save(notification);
    }
}