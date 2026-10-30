package com.example.celebrity_crm.schedule.repository;

import com.example.celebrity_crm.schedule.model.ScheduleEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, Long> {

    Optional<ScheduleEvent> findFirstByUserIdAndTypeAndEventDateOrderByEventTime(Long userId, String type, LocalDate date);

    List<ScheduleEvent> findTop3ByUserIdAndEventDateAfterOrderByEventDateAscEventTimeAsc(Long userId, LocalDate date);

    List<ScheduleEvent> findByUserIdOrderByEventDateAscEventTimeAsc(Long userId);
}