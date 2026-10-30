package com.example.celebrity_crm.schedule.service;

import com.example.celebrity_crm.schedule.dto.ScheduleRequest;
import com.example.celebrity_crm.schedule.model.ScheduleEvent;
import com.example.celebrity_crm.schedule.repository.ScheduleEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleEventRepository repository;

    public ScheduleService(ScheduleEventRepository repository) {
        this.repository = repository;
    }

    public List<ScheduleEvent> list(Long userId) {
        return repository.findByUserIdOrderByEventDateAscEventTimeAsc(userId);
    }

    public ScheduleEvent add(Long userId, ScheduleRequest request) {
        ScheduleEvent event = new ScheduleEvent();
        event.setUserId(userId);
        fill(event, request);
        return repository.save(event);
    }

    public ScheduleEvent update(Long userId, Long id, ScheduleRequest request) {
        ScheduleEvent event = find(userId, id);
        fill(event, request);
        return repository.save(event);
    }

    public void delete(Long userId, Long id) {
        repository.delete(find(userId, id));
    }

    private ScheduleEvent find(Long userId, Long id) {
        return repository.findById(id)
                .filter(e -> e.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
    }

    private void fill(ScheduleEvent event, ScheduleRequest request) {
        event.setTitle(request.title());
        event.setScene(request.scene());
        event.setType(request.type());
        event.setShift(request.shift());
        event.setEventDate(request.eventDate());
        event.setEventTime(request.eventTime());
        event.setLocation(request.location());
        event.setVanity(request.vanity());
        event.setCostume(request.costume());
    }
}