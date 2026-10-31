package com.example.celebrity_crm.project.service;

import com.example.celebrity_crm.project.dto.ProjectRequest;
import com.example.celebrity_crm.project.dto.ProjectResponse;
import com.example.celebrity_crm.project.model.Project;
import com.example.celebrity_crm.project.model.ProjectMember;
import com.example.celebrity_crm.project.repository.ProjectMemberRepository;
import com.example.celebrity_crm.project.repository.ProjectRepository;
import com.example.celebrity_crm.schedule.repository.ScheduleEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProjectService {

    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);

    private final ProjectRepository projects;
    private final ProjectMemberRepository members;
    private final ScheduleEventRepository schedule;

    public ProjectService(ProjectRepository projects, ProjectMemberRepository members,
                          ScheduleEventRepository schedule) {
        this.projects = projects;
        this.members = members;
        this.schedule = schedule;
    }

    public List<ProjectResponse> list(Long userId) {
        List<Project> list = projects.findByUserIdOrderByIdAsc(userId);
        List<Long> ids = list.stream().map(Project::getId).toList();
        Map<Long, List<ProjectMember>> team = members.findByProjectIdIn(ids).stream()
                .collect(Collectors.groupingBy(ProjectMember::getProjectId));
        LocalDate today = LocalDate.now();
        return list.stream()
                .map(p -> toResponse(p, team.getOrDefault(p.getId(), List.of()), today))
                .toList();
    }

    @Transactional
    public ProjectResponse add(Long userId, ProjectRequest request) {
        Project project = new Project();
        project.setUserId(userId);
        fill(project, request);
        project = projects.save(project);
        saveTeam(project.getId(), request.team());
        return one(project);
    }

    @Transactional
    public ProjectResponse update(Long userId, Long id, ProjectRequest request) {
        Project project = find(userId, id);
        fill(project, request);
        project = projects.save(project);
        saveTeam(project.getId(), request.team());
        return one(project);
    }

    @Transactional
    public void delete(Long userId, Long id) {
        Project project = find(userId, id);
        members.deleteByProjectId(project.getId());
        projects.delete(project);
    }

    private Project find(Long userId, Long id) {
        return projects.findById(id)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found."));
    }

    private ProjectResponse one(Project project) {
        List<ProjectMember> team = members.findByProjectIdIn(List.of(project.getId()));
        return toResponse(project, team, LocalDate.now());
    }

    private void fill(Project project, ProjectRequest request) {
        project.setTitle(request.title());
        project.setType(request.type());
        project.setRole(request.role());
        project.setCompany(request.company());
        project.setDirector(request.director());
        project.setStatus(request.status());
        project.setPhase(request.phase());
        project.setProgress(request.progress());
        project.setProgressLabel(request.progressLabel());
        project.setReleaseLabel(request.release());

        ProjectRequest.Money money = request.money();
        project.setMoneyTotal(money == null ? 0 : money.total());
        project.setMoneyReceived(money == null ? 0 : money.received());
        project.setNextPayment(money == null ? null : money.next());

        project.setContractStatus(request.contract() == null ? "draft" : request.contract());
    }

    private void saveTeam(Long projectId, List<ProjectRequest.Member> team) {
        members.deleteByProjectId(projectId);
        if (team == null) {
            return;
        }
        for (ProjectRequest.Member item : team) {
            ProjectMember member = new ProjectMember();
            member.setProjectId(projectId);
            member.setName(item.name());
            member.setRole(item.role());
            member.setPhone(item.phone());
            members.save(member);
        }
    }

    private ProjectResponse toResponse(Project p, List<ProjectMember> team, LocalDate today) {
        List<ProjectResponse.Member> people = team.stream()
                .map(m -> new ProjectResponse.Member(m.getName(), m.getRole(), m.getPhone()))
                .toList();
        return new ProjectResponse(p.getId(), p.getTitle(), p.getType(), p.getRole(), p.getCompany(),
                p.getDirector(), p.getStatus(), p.getPhase(), p.getProgress(), p.getProgressLabel(),
                p.getReleaseLabel(), nextCall(p, today),
                new ProjectResponse.Money(p.getMoneyTotal(), p.getMoneyReceived(), p.getNextPayment()),
                p.getContractStatus(), people);
    }

    private String nextCall(Project project, LocalDate today) {
        if ("completed".equals(project.getStatus())) {
            return null;
        }
        List<String> names = Stream.of(project.getTitle(), project.getCompany())
                .filter(Objects::nonNull)
                .toList();
        return schedule
                .findFirstByUserIdAndProjectNameInAndEventDateGreaterThanEqualOrderByEventDateAscCallTimeAsc(
                        project.getUserId(), names, today)
                .map(e -> dayWord(e.getEventDate(), today) + ", " + e.getCallTime().format(TIME))
                .orElse(null);
    }

    private String dayWord(LocalDate date, LocalDate today) {
        long days = ChronoUnit.DAYS.between(today, date);
        if (days == 0) {
            return "Today";
        }
        return days == 1 ? "Tomorrow" : "In " + days + " days";
    }
}