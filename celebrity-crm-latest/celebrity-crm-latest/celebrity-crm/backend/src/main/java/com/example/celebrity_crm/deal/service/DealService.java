package com.example.celebrity_crm.deal.service;

import com.example.celebrity_crm.deal.dto.DealRequest;
import com.example.celebrity_crm.deal.dto.DealResponse;
import com.example.celebrity_crm.deal.model.Deal;
import com.example.celebrity_crm.deal.repository.DealRepository;
import com.example.celebrity_crm.notification.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class DealService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    private final DealRepository repository;
    private final NotificationService notifications;

    public DealService(DealRepository repository, NotificationService notifications) {
        this.repository = repository;
        this.notifications = notifications;
    }

    public List<DealResponse> list(Long userId) {
        return repository.findByUserIdOrderByIdDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public DealResponse add(Long userId, DealRequest request) {
        Deal deal = new Deal();
        deal.setUserId(userId);
        deal.setStatus("Negotiating");
        deal.setCategory("New partnership");
        deal.setDeliverables("To be agreed");
        deal.setContact("Add a brand contact");
        deal.setNextStep("Confirm the brief and deliverables");
        fill(deal, request);
        Deal saved = repository.save(deal);
        notifications.add(userId, "New brand deal",
                saved.getBrand() + " - " + saved.getCampaign() + " was added to your deals.", "deals");
        return toResponse(saved);
    }

    public DealResponse update(Long userId, Long id, DealRequest request) {
        Deal deal = find(userId, id);
        fill(deal, request);
        return toResponse(repository.save(deal));
    }

    public void delete(Long userId, Long id) {
        repository.delete(find(userId, id));
    }

    private Deal find(Long userId, Long id) {
        return repository.findById(id)
                .filter(d -> d.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deal not found."));
    }

    private void fill(Deal deal, DealRequest request) {
        deal.setBrand(request.brand().trim());
        deal.setCampaign(request.campaign().trim());
        deal.setPlatform(request.platform().trim());
        deal.setAmount(request.value());
        if (request.category() != null && !request.category().isBlank()) {
            deal.setCategory(request.category());
        }
        if (request.deliverables() != null && !request.deliverables().isBlank()) {
            deal.setDeliverables(request.deliverables());
        }
        if (request.contact() != null && !request.contact().isBlank()) {
            deal.setContact(request.contact());
        }
        if (request.nextStep() != null && !request.nextStep().isBlank()) {
            deal.setNextStep(request.nextStep());
        }
        if (request.dueDate() != null) {
            deal.setDueDate(request.dueDate());
        }
    }

    private DealResponse toResponse(Deal d) {
        return new DealResponse(d.getId(), d.getBrand(), d.getCampaign(), d.getCategory(), d.getPlatform(),
                d.getAmount(), d.getStatus(), d.getDeliverables(),
                d.getDueDate() == null ? "To be scheduled" : d.getDueDate().format(DATE),
                d.getContact(), d.getNextStep());
    }
}