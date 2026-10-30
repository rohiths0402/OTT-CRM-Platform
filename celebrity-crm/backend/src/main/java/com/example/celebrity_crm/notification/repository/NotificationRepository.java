package com.example.celebrity_crm.notification.repository;

import com.example.celebrity_crm.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}