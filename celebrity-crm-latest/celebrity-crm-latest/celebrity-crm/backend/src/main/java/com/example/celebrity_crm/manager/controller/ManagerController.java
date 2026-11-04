package com.example.celebrity_crm.manager.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.manager.dto.TaskRequest;
import com.example.celebrity_crm.manager.dto.TaskResponse;
import com.example.celebrity_crm.manager.dto.TeamMemberRequest;
import com.example.celebrity_crm.manager.dto.TeamMemberResponse;
import com.example.celebrity_crm.manager.service.ManagerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService service;
    private final CurrentUser currentUser;

    public ManagerController(ManagerService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping("/team")
    public List<TeamMemberResponse> team(Authentication authentication) {
        return service.listMembers(currentUser.id(authentication));
    }

    @PostMapping("/team")
    public TeamMemberResponse addMember(Authentication authentication,
                                        @Valid @RequestBody TeamMemberRequest request) {
        return service.addMember(currentUser.id(authentication), request);
    }

    @DeleteMapping("/team/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMember(Authentication authentication, @PathVariable Long id) {
        service.deleteMember(currentUser.id(authentication), id);
    }

    @GetMapping("/tasks")
    public List<TaskResponse> tasks(Authentication authentication) {
        return service.listTasks(currentUser.id(authentication));
    }

    @PostMapping("/tasks")
    public TaskResponse addTask(Authentication authentication, @Valid @RequestBody TaskRequest request) {
        return service.addTask(currentUser.id(authentication), request);
    }

    @PutMapping("/tasks/{id}/toggle")
    public TaskResponse toggleTask(Authentication authentication, @PathVariable Long id) {
        return service.toggleTask(currentUser.id(authentication), id);
    }

    @DeleteMapping("/tasks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(Authentication authentication, @PathVariable Long id) {
        service.deleteTask(currentUser.id(authentication), id);
    }
}