package com.example.celebrity_crm.schedule.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.schedule.dto.ScheduleRequest;
import com.example.celebrity_crm.schedule.dto.ScheduleResponse;
import com.example.celebrity_crm.schedule.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final ScheduleService service;
    private final CurrentUser currentUser;

    public ScheduleController(ScheduleService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<ScheduleResponse> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PostMapping
    public ScheduleResponse add(Authentication authentication, @Valid @RequestBody ScheduleRequest request) {
        return service.add(currentUser.id(authentication), request);
    }

    @PutMapping("/{id}")
    public ScheduleResponse update(Authentication authentication, @PathVariable Long id,
                                   @Valid @RequestBody ScheduleRequest request) {
        return service.update(currentUser.id(authentication), id, request);
    }

    @PutMapping("/{id}/accept")
    public ScheduleResponse accept(Authentication authentication, @PathVariable Long id) {
        return service.accept(currentUser.id(authentication), id);
    }

    @PutMapping("/{id}/decline")
    public ScheduleResponse decline(Authentication authentication, @PathVariable Long id) {
        return service.decline(currentUser.id(authentication), id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        service.delete(currentUser.id(authentication), id);
    }
}