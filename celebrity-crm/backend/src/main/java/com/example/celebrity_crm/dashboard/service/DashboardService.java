package com.example.celebrity_crm.dashboard.service;

import com.example.celebrity_crm.auth.StaffUser;
import com.example.celebrity_crm.auth.StaffUserRepository;
import com.example.celebrity_crm.contract.model.Contract;
import com.example.celebrity_crm.contract.repository.ContractRepository;
import com.example.celebrity_crm.dashboard.dto.DashboardResponse;
import com.example.celebrity_crm.deal.model.Deal;
import com.example.celebrity_crm.deal.repository.DealRepository;
import com.example.celebrity_crm.notification.model.Notification;
import com.example.celebrity_crm.notification.repository.NotificationRepository;
import com.example.celebrity_crm.payment.model.Payment;
import com.example.celebrity_crm.payment.repository.PaymentRepository;
import com.example.celebrity_crm.profile.model.CelebrityProfile;
import com.example.celebrity_crm.profile.repository.CelebrityProfileRepository;
import com.example.celebrity_crm.project.repository.ProjectRepository;
import com.example.celebrity_crm.schedule.repository.ScheduleEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardService {

    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);
    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("d", Locale.ENGLISH);
    private static final DateTimeFormatter MONTH = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);
    private static final DateTimeFormatter DAY_MONTH = DateTimeFormatter.ofPattern("d MMM", Locale.ENGLISH);

    private final StaffUserRepository users;
    private final CelebrityProfileRepository profiles;
    private final ScheduleEventRepository schedule;
    private final ContractRepository contracts;
    private final DealRepository deals;
    private final PaymentRepository payments;
    private final ProjectRepository projects;
    private final NotificationRepository notifications;

    public DashboardService(StaffUserRepository users, CelebrityProfileRepository profiles,
                            ScheduleEventRepository schedule, ContractRepository contracts,
                            DealRepository deals, PaymentRepository payments,
                            ProjectRepository projects, NotificationRepository notifications) {
        this.users = users;
        this.profiles = profiles;
        this.schedule = schedule;
        this.contracts = contracts;
        this.deals = deals;
        this.payments = payments;
        this.projects = projects;
        this.notifications = notifications;
    }

    public DashboardResponse get(String email) {
        StaffUser user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in."));
        Long userId = user.getId();
        LocalDate today = LocalDate.now();

        return new DashboardResponse(
                todayShoot(userId, today),
                manager(userId),
                attention(userId, today),
                upcoming(userId, today),
                payments(userId, today),
                projectList(userId),
                notificationList(userId));
    }

    private DashboardResponse.TodayShoot todayShoot(Long userId, LocalDate today) {
        return schedule.findFirstByUserIdAndTypeAndEventDateOrderByEventTime(userId, "SHOOT", today)
                .map(e -> new DashboardResponse.TodayShoot(e.getTitle(), e.getScene(), e.getShift(),
                        time(e.getEventTime()), e.getLocation(), e.getVanity(), e.getCostume()))
                .orElse(null);
    }

    private DashboardResponse.Manager manager(Long userId) {
        CelebrityProfile profile = profiles.findByUserId(userId).orElse(null);
        if (profile == null) {
            return null;
        }
        String phone = profile.getManagerPhone();
        String display = phone;
        if (phone != null && phone.length() == 12) {
            display = "+" + phone.substring(0, 2) + " " + phone.substring(2, 7) + " " + phone.substring(7);
        }
        return new DashboardResponse.Manager(profile.getManagerName(), phone, display);
    }

    private List<DashboardResponse.Attention> attention(Long userId, LocalDate today) {
        List<DashboardResponse.Attention> list = new ArrayList<>();
        for (Contract c : contracts.findByUserIdAndStatusOrderByDueDate(userId, "PENDING")) {
            list.add(new DashboardResponse.Attention("c" + c.getId(),
                    "Sign the " + c.getTitle().toLowerCase(), c.getParty(),
                    tag(c.getDueDate(), today), tone(c.getDueDate(), today), "contracts"));
        }
        for (Deal d : deals.findByUserIdAndStatusOrderByDueDate(userId, "PENDING")) {
            list.add(new DashboardResponse.Attention("d" + d.getId(),
                    "Approve the " + d.getTitle().toLowerCase(), d.getDetail(),
                    tag(d.getDueDate(), today), tone(d.getDueDate(), today), "deals"));
        }
        return list;
    }

    private List<DashboardResponse.Upcoming> upcoming(Long userId, LocalDate today) {
        return schedule.findTop3ByUserIdAndEventDateAfterOrderByEventDateAscEventTimeAsc(userId, today)
                .stream()
                .map(e -> new DashboardResponse.Upcoming(e.getId(),
                        e.getEventDate().format(DAY), e.getEventDate().format(MONTH),
                        e.getTitle(), e.getLocation(), time(e.getEventTime())))
                .toList();
    }

    private DashboardResponse.Payments payments(Long userId, LocalDate today) {
        long received = 0;
        long waiting = 0;
        Payment next = null;
        for (Payment p : payments.findByUserId(userId)) {
            if ("RECEIVED".equals(p.getStatus())) {
                if (p.getPayDate() != null && p.getPayDate().getMonth() == today.getMonth()
                        && p.getPayDate().getYear() == today.getYear()) {
                    received += p.getAmount();
                }
            } else {
                waiting += p.getAmount();
                if (next == null || (p.getPayDate() != null && p.getPayDate().isBefore(next.getPayDate()))) {
                    next = p;
                }
            }
        }
        String nextText = next == null ? "-" : next.getPayer() + ", " + next.getPayDate().format(DAY_MONTH);
        return new DashboardResponse.Payments(received, waiting, nextText);
    }

    private List<DashboardResponse.ProjectItem> projectList(Long userId) {
        return projects.findByUserIdOrderByIdDesc(userId).stream()
                .map(p -> new DashboardResponse.ProjectItem(p.getId(), p.getTitle(), p.getRole(),
                        p.getPhase(), p.getProgress()))
                .toList();
    }

    private List<DashboardResponse.NotificationItem> notificationList(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<DashboardResponse.NotificationItem> list = new ArrayList<>();
        for (Notification n : notifications.findTop10ByUserIdOrderByCreatedAtDesc(userId)) {
            list.add(new DashboardResponse.NotificationItem(n.getId(), n.getTitle(), n.getMessage(),
                    ago(n.getCreatedAt(), now), n.isSeen()));
        }
        return list;
    }

    private String time(LocalTime time) {
        return time == null ? "" : time.format(TIME);
    }

    private String tag(LocalDate due, LocalDate today) {
        if (due == null) {
            return "Later";
        }
        long days = ChronoUnit.DAYS.between(today, due);
        if (days <= 0) {
            return "Today";
        }
        return days <= 7 ? "This week" : "Later";
    }

    private String tone(LocalDate due, LocalDate today) {
        return "Today".equals(tag(due, today)) ? "gold" : "aqua";
    }

    private String ago(LocalDateTime time, LocalDateTime now) {
        long minutes = Duration.between(time, now).toMinutes();
        if (minutes < 1) {
            return "just now";
        }
        if (minutes < 60) {
            return minutes + "m ago";
        }
        if (minutes < 60 * 24) {
            return (minutes / 60) + "h ago";
        }
        return (minutes / (60 * 24)) + "d ago";
    }
}