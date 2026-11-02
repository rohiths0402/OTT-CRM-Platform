package com.example.celebrity_crm.manager.service;

import com.example.celebrity_crm.manager.dto.TaskRequest;
import com.example.celebrity_crm.manager.dto.TaskResponse;
import com.example.celebrity_crm.manager.dto.TeamMemberRequest;
import com.example.celebrity_crm.manager.dto.TeamMemberResponse;
import com.example.celebrity_crm.manager.model.ManagerTask;
import com.example.celebrity_crm.manager.model.TeamMember;
import com.example.celebrity_crm.manager.repository.ManagerTaskRepository;
import com.example.celebrity_crm.manager.repository.TeamMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class ManagerService {

    private final TeamMemberRepository members;
    private final ManagerTaskRepository tasks;

    public ManagerService(TeamMemberRepository members, ManagerTaskRepository tasks) {
        this.members = members;
        this.tasks = tasks;
    }

    public List<TeamMemberResponse> listMembers(Long userId) {
        return members.findByUserIdOrderByIdDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public TeamMemberResponse addMember(Long userId, TeamMemberRequest request) {
        TeamMember member = new TeamMember();
        member.setUserId(userId);
        member.setName(request.name().trim());
        member.setRole(request.role().trim());
        member.setPhone(clean(request.phone()));
        member.setEmail(clean(request.email()));
        member.setFocus(clean(request.focus()));
        return toResponse(members.save(member));
    }

    public void deleteMember(Long userId, Long id) {
        TeamMember member = members.findById(id)
                .filter(m -> m.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found."));
        members.delete(member);
    }

    public List<TaskResponse> listTasks(Long userId) {
        return tasks.findByUserIdOrderByIdDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse addTask(Long userId, TaskRequest request) {
        ManagerTask task = new ManagerTask();
        task.setUserId(userId);
        task.setTitle(request.title().trim());
        task.setAssignee(clean(request.assignee()));
        if (request.dueDate() != null && !request.dueDate().isBlank()) {
            task.setDueDate(LocalDate.parse(request.dueDate()));
        }
        return toResponse(tasks.save(task));
    }

    public TaskResponse toggleTask(Long userId, Long id) {
        ManagerTask task = findTask(userId, id);
        task.setDone(!task.isDone());
        return toResponse(tasks.save(task));
    }

    public void deleteTask(Long userId, Long id) {
        tasks.delete(findTask(userId, id));
    }

    private ManagerTask findTask(Long userId, Long id) {
        return tasks.findById(id)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found."));
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private TeamMemberResponse toResponse(TeamMember m) {
        return new TeamMemberResponse(m.getId(), m.getName(), m.getRole(),
                m.getPhone(), m.getEmail(), m.getFocus());
    }

    private TaskResponse toResponse(ManagerTask t) {
        return new TaskResponse(t.getId(), t.getTitle(),
                t.getDueDate() == null ? null : t.getDueDate().toString(),
                t.getAssignee(), t.isDone());
    }
}