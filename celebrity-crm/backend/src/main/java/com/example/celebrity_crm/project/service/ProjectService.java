package com.example.celebrity_crm.project.service;

import com.example.celebrity_crm.project.dto.ProjectRequest;
import com.example.celebrity_crm.project.model.Project;
import com.example.celebrity_crm.project.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public List<Project> list(Long userId) {
        return repository.findByUserIdOrderByIdDesc(userId);
    }

    public Project add(Long userId, ProjectRequest request) {
        Project project = new Project();
        project.setUserId(userId);
        fill(project, request);
        return repository.save(project);
    }

    public Project update(Long userId, Long id, ProjectRequest request) {
        Project project = find(userId, id);
        fill(project, request);
        return repository.save(project);
    }

    public void delete(Long userId, Long id) {
        repository.delete(find(userId, id));
    }

    private Project find(Long userId, Long id) {
        return repository.findById(id)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
    }

    private void fill(Project project, ProjectRequest request) {
        project.setTitle(request.title());
        project.setRole(request.role());
        project.setPhase(request.phase());
        project.setProgress(request.progress());
    }
}