package com.example.celebrity_crm.project.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.project.dto.ProjectRequest;
import com.example.celebrity_crm.project.model.Project;
import com.example.celebrity_crm.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService service;
    private final CurrentUser currentUser;

    public ProjectController(ProjectService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<Project> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PostMapping
    public Project add(Authentication authentication, @Valid @RequestBody ProjectRequest request) {
        return service.add(currentUser.id(authentication), request);
    }

    @PutMapping("/{id}")
    public Project update(Authentication authentication, @PathVariable Long id,
                          @Valid @RequestBody ProjectRequest request) {
        return service.update(currentUser.id(authentication), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        service.delete(currentUser.id(authentication), id);
    }
}