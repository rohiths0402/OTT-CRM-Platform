package com.example.celebrity_crm.analytics.service;

import com.example.celebrity_crm.analytics.dto.AnalyticsResponse;
import com.example.celebrity_crm.contract.model.Contract;
import com.example.celebrity_crm.contract.repository.ContractRepository;
import com.example.celebrity_crm.deal.model.Deal;
import com.example.celebrity_crm.deal.repository.DealRepository;
import com.example.celebrity_crm.payment.model.Payment;
import com.example.celebrity_crm.payment.repository.PaymentRepository;
import com.example.celebrity_crm.project.model.Project;
import com.example.celebrity_crm.project.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class AnalyticsService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);
    private static final List<String> OPEN_DEALS = List.of("In production", "Negotiating");

    private final PaymentRepository payments;
    private final DealRepository deals;
    private final ProjectRepository projects;
    private final ContractRepository contracts;

    @Value("${analytics.annual-target:120000000}")
    private long annualTarget;

    public AnalyticsService(PaymentRepository payments, DealRepository deals,
                            ProjectRepository projects, ContractRepository contracts) {
        this.payments = payments;
        this.deals = deals;
        this.projects = projects;
        this.contracts = contracts;
    }

    public AnalyticsResponse get(Long userId) {
        List<Payment> paymentList = payments.findByUserId(userId);
        long collected = paymentList.stream()
                .filter(p -> "received".equals(p.getStatus()))
                .mapToLong(Payment::getReceivedAmount)
                .sum();
        long pending = paymentList.stream()
                .filter(p -> "due".equals(p.getStatus()))
                .mapToLong(Payment::getAmount)
                .sum();

        List<Deal> dealList = deals.findByUserIdOrderByIdDesc(userId);
        List<Deal> openDeals = dealList.stream()
                .filter(d -> OPEN_DEALS.contains(d.getStatus()))
                .toList();
        long pipelineValue = openDeals.stream().mapToLong(Deal::getAmount).sum();

        List<Project> projectList = projects.findByUserIdOrderByIdDesc(userId);
        List<Contract> contractList = contracts.findByUserIdOrderByIdDesc(userId);

        return new AnalyticsResponse(
                collected,
                pending,
                annualTarget,
                pipelineValue,
                openDeals.size(),
                countProjects(projectList, "active"),
                countProjects(projectList, "upcoming"),
                countProjects(projectList, "completed"),
                (int) contractList.stream().filter(c -> "Signed".equals(c.getStatus())).count(),
                contractList.size(),
                dealList.stream().map(this::toItem).toList());
    }

    private int countProjects(List<Project> list, String status) {
        return (int) list.stream().filter(p -> status.equals(p.getStatus())).count();
    }

    private AnalyticsResponse.DealItem toItem(Deal d) {
        return new AnalyticsResponse.DealItem(d.getId(), d.getBrand(), d.getCampaign(), d.getAmount(),
                d.getStatus(),
                d.getDueDate() == null ? "To be scheduled" : d.getDueDate().format(DATE),
                d.getContact(), d.getNextStep());
    }
}