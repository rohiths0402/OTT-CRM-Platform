package com.example.celebrity_crm.payment.service;

import com.example.celebrity_crm.payment.dto.PaymentRequest;
import com.example.celebrity_crm.payment.model.Payment;
import com.example.celebrity_crm.payment.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository repository;

    public PaymentService(PaymentRepository repository) {
        this.repository = repository;
    }

    public List<Payment> list(Long userId) {
        return repository.findByUserId(userId);
    }

    public Payment add(Long userId, PaymentRequest request) {
        Payment payment = new Payment();
        payment.setUserId(userId);
        fill(payment, request);
        return repository.save(payment);
    }

    public Payment update(Long userId, Long id, PaymentRequest request) {
        Payment payment = find(userId, id);
        fill(payment, request);
        return repository.save(payment);
    }

    public void delete(Long userId, Long id) {
        repository.delete(find(userId, id));
    }

    private Payment find(Long userId, Long id) {
        return repository.findById(id)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found."));
    }

    private void fill(Payment payment, PaymentRequest request) {
        payment.setPayer(request.payer());
        payment.setAmount(request.amount());
        payment.setStatus(request.status());
        payment.setPayDate(request.payDate());
    }
}