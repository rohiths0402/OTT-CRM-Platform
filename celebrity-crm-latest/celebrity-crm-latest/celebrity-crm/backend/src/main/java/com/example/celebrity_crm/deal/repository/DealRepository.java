package com.example.celebrity_crm.deal.repository;

import com.example.celebrity_crm.deal.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface DealRepository extends JpaRepository<Deal, Long> {

    List<Deal> findByUserIdAndStatusInOrderByDueDate(Long userId, Collection<String> statuses);

    List<Deal> findByUserIdOrderByIdDesc(Long userId);
}