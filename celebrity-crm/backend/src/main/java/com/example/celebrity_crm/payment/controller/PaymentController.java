package com.example.celebrity_crm.payment.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.payment.dto.PaymentRequest;
import com.example.celebrity_crm.payment.model.Payment;
import com.example.celebrity_crm.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;
    private final CurrentUser currentUser;

    public PaymentController(PaymentService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<Payment> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PostMapping
    public Payment add(Authentication authentication, @Valid @RequestBody PaymentRequest request) {
        return service.add(currentUser.id(authentication), request);
    }

    @PutMapping("/{id}")
    public Payment update(Authentication authentication, @PathVariable Long id,
                          @Valid @RequestBody PaymentRequest request) {
        return service.update(currentUser.id(authentication), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        service.delete(currentUser.id(authentication), id);
    }
}