package com.example.celebrity_crm.deal.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.deal.dto.DealRequest;
import com.example.celebrity_crm.deal.dto.DealResponse;
import com.example.celebrity_crm.deal.service.DealService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService service;
    private final CurrentUser currentUser;

    public DealController(DealService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<DealResponse> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PostMapping
    public DealResponse add(Authentication authentication, @Valid @RequestBody DealRequest request) {
        return service.add(currentUser.id(authentication), request);
    }

    @PutMapping("/{id}")
    public DealResponse update(Authentication authentication, @PathVariable Long id,
                               @Valid @RequestBody DealRequest request) {
        return service.update(currentUser.id(authentication), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        service.delete(currentUser.id(authentication), id);
    }
}