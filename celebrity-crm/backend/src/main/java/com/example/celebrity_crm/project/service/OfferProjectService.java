package com.example.celebrity_crm.project.service;

import com.example.celebrity_crm.project.model.Project;
import com.example.celebrity_crm.project.model.ProjectMember;
import com.example.celebrity_crm.project.repository.ProjectMemberRepository;
import com.example.celebrity_crm.project.repository.ProjectRepository;
import com.example.celebrity_crm.schedule.model.ScheduleEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class OfferProjectService {

    private static final DateTimeFormatter DAY_MONTH = DateTimeFormatter.ofPattern("d MMM", Locale.ENGLISH);

    private final ProjectRepository projects;
    private final ProjectMemberRepository members;

    public OfferProjectService(ProjectRepository projects, ProjectMemberRepository members) {
        this.projects = projects;
        this.members = members;
    }

    @Transactional
    public void addFromEvent(Long userId, ScheduleEvent event) {
        String title = event.getProjectName() != null ? event.getProjectName() : event.getTitle();
        if (projects.existsByUserIdAndTitleIgnoreCase(userId, title)) {
            return;
        }

        String place = Stream.of(event.getLocation(), event.getCity())
                .filter(s -> s != null && !s.isBlank())
                .collect(Collectors.joining(", "));
        String starts = "Starts " + event.getEventDate().format(DAY_MONTH) + (place.isEmpty() ? "" : ", " + place);

        Project project = new Project();
        project.setUserId(userId);
        project.setTitle(title);
        project.setType(typeLabel(event.getType()));
        project.setRole("Actor");
        project.setCompany(event.getCompany());
        project.setDirector("To be announced");
        project.setStatus("upcoming");
        project.setPhase("Accepted");
        project.setProgress(0);
        project.setProgressLabel(starts);
        project.setReleaseLabel("To be announced");
        project.setMoneyTotal(event.getTotalAmount());
        project.setMoneyReceived(0);
        project.setNextPayment(event.getAdvanceAmount() > 0
                ? "Advance " + rupees(event.getAdvanceAmount()) + " before the shoot"
                : null);
        project.setContractStatus("awaiting");
        project = projects.save(project);

        if (event.getContactName() != null) {
            ProjectMember member = new ProjectMember();
            member.setProjectId(project.getId());
            member.setName(event.getContactName());
            member.setRole(event.getContactRole());
            member.setPhone(event.getContactPhone());
            members.save(member);
        }
    }

    private String typeLabel(String type) {
        return switch (type) {
            case "shoot" -> "Film shoot";
            case "brand" -> "Brand shoot";
            case "press" -> "Press";
            case "meeting" -> "Meeting";
            default -> "Booking";
        };
    }

    private String rupees(long amount) {
        if (amount >= 10000000) {
            return "₹ " + trim(amount / 10000000.0) + " Cr";
        }
        if (amount >= 100000) {
            return "₹ " + trim(amount / 100000.0) + " L";
        }
        return "₹ " + amount;
    }

    private String trim(double value) {
        return String.valueOf(Math.round(value * 100) / 100.0).replaceAll("\\.0$", "");
    }
}