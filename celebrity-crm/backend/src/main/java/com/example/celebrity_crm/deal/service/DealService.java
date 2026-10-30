package com.example.celebrity_crm.deal.service;

import com.example.celebrity_crm.deal.dto.DealRequest;
import com.example.celebrity_crm.deal.model.Deal;
import com.example.celebrity_crm.deal.repository.DealRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DealService {

    private final DealRepository repository;

    public DealService(DealRepository repository) {
        this.repository = repository;
    }

    public List<Deal> list(Long userId) {
        return repository.findByUserIdOrderByIdDesc(userId);
    }

    public Deal add(Long userId, DealRequest request) {
        Deal deal = new Deal();
        deal.setUserId(userId);
        deal.setStatus("PENDING");
        fill(deal, request);
        return repository.save(deal);
    }

    public Deal update(Long userId, Long id, DealRequest request) {
        Deal deal = find(userId, id);
        fill(deal, request);
        return repository.save(deal);
    }

    public Deal approve(Long userId, Long id) {
        Deal deal = find(userId, id);
        deal.setStatus("APPROVED");
        return repository.save(deal);
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
        deal.setTitle(request.title());
        deal.setDetail(request.detail());
        deal.setDueDate(request.dueDate());
    }
}