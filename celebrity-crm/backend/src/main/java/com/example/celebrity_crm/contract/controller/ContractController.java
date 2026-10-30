package com.example.celebrity_crm.contract.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.contract.dto.ContractRequest;
import com.example.celebrity_crm.contract.model.Contract;
import com.example.celebrity_crm.contract.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService service;
    private final CurrentUser currentUser;

    public ContractController(ContractService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<Contract> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PostMapping
    public Contract add(Authentication authentication, @Valid @RequestBody ContractRequest request) {
        return service.add(currentUser.id(authentication), request);
    }

    @PutMapping("/{id}")
    public Contract update(Authentication authentication, @PathVariable Long id,
                           @Valid @RequestBody ContractRequest request) {
        return service.update(currentUser.id(authentication), id, request);
    }

    @PutMapping("/{id}/sign")
    public Contract sign(Authentication authentication, @PathVariable Long id) {
        return service.sign(currentUser.id(authentication), id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        service.delete(currentUser.id(authentication), id);
    }
}