package com.example.celebrity_crm.notification.service;

import com.example.celebrity_crm.notification.dto.NotificationResponse;
import com.example.celebrity_crm.notification.model.Notification;
import com.example.celebrity_crm.notification.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public List<NotificationResponse> list(Long userId) {
        return repository.findTop10ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public NotificationResponse markRead(Long userId, Long id) {
        Notification notification = repository.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));
        notification.setSeen(true);
        return toResponse(repository.save(notification));
    }

    public void markAllRead(Long userId) {
        List<Notification> unread = repository.findByUserIdAndSeenFalse(userId);
        unread.forEach(n -> n.setSeen(true));
        repository.saveAll(unread);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(n.getId(), n.getTitle(), n.getMessage(),
                ago(n.getCreatedAt()), n.isSeen(), n.getTarget());
    }

    private String ago(LocalDateTime time) {
        long minutes = Duration.between(time, LocalDateTime.now()).toMinutes();
        if (minutes < 1) {
            return "just now";
        }
        if (minutes < 60) {
            return minutes + "m ago";
        }
        if (minutes < 60 * 24) {
            return (minutes / 60) + "h ago";
        }
        return (minutes / (60 * 24)) + "d ago";
    }
}