package com.example.celebrity_crm.payment.repository;

import com.example.celebrity_crm.payment.model.SentPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SentPaymentRepository extends JpaRepository<SentPayment, Long> {

    List<SentPayment> findByUserIdOrderByIdDesc(Long userId);
}