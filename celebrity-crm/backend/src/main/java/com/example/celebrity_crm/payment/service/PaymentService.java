package com.example.celebrity_crm.payment.service;

import com.example.celebrity_crm.payment.dto.PaymentResponse;
import com.example.celebrity_crm.payment.dto.SentPaymentRequest;
import com.example.celebrity_crm.payment.dto.SentPaymentResponse;
import com.example.celebrity_crm.payment.dto.SettleRequest;
import com.example.celebrity_crm.payment.model.Payment;
import com.example.celebrity_crm.payment.model.SentPayment;
import com.example.celebrity_crm.payment.repository.PaymentRepository;
import com.example.celebrity_crm.payment.repository.SentPaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository payments;
    private final SentPaymentRepository sentPayments;

    public PaymentService(PaymentRepository payments, SentPaymentRepository sentPayments) {
        this.payments = payments;
        this.sentPayments = sentPayments;
    }

    public List<PaymentResponse> list(Long userId) {
        return payments.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public PaymentResponse settle(Long userId, Long id, SettleRequest request) {
        Payment payment = payments.findById(id)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found."));

        if ("received".equals(payment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This payment is already received.");
        }
        long remaining = payment.getAmount() - payment.getReceivedAmount();
        if (request.amount() > remaining) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The amount is more than the balance.");
        }

        payment.setReceivedAmount(payment.getReceivedAmount() + request.amount());
        payment.setMethod(request.method());
        payment.setReference(request.reference().trim());
        payment.setReceivedOn(LocalDate.now());
        if (payment.getReceivedAmount() >= payment.getAmount()) {
            payment.setStatus("received");
        }
        return toResponse(payments.save(payment));
    }

    public List<SentPaymentResponse> sentList(Long userId) {
        return sentPayments.findByUserIdOrderByIdDesc(userId).stream()
                .map(this::toSentResponse)
                .toList();
    }

    public SentPaymentResponse addSent(Long userId, SentPaymentRequest request) {
        SentPayment sent = new SentPayment();
        sent.setUserId(userId);
        sent.setRecipient(request.recipient().trim());
        sent.setUpiId(request.upiId().trim());
        sent.setAmount(request.amount());
        sent.setNote(request.note() == null || request.note().isBlank() ? "Personal payment" : request.note().trim());
        sent.setReference(request.reference().trim());
        return toSentResponse(sentPayments.save(sent));
    }

    private PaymentResponse toResponse(Payment p) {
        boolean received = "received".equals(p.getStatus());
        String status = p.getStatus();
        if ("due".equals(status) && p.getPayDate() != null && p.getPayDate().isBefore(LocalDate.now())) {
            status = "overdue";
        }
        LocalDate date = received && p.getReceivedOn() != null ? p.getReceivedOn() : p.getPayDate();
        long receivedAmount = received && p.getReceivedAmount() == 0 ? p.getAmount() : p.getReceivedAmount();
        return new PaymentResponse(p.getId(), p.getProject(), p.getProjectType(), p.getPayer(), p.getKind(),
                p.getAmount(), status, (date == null ? LocalDate.now() : date).toString(),
                p.getReference(), p.getNote(), p.getMethod(), receivedAmount);
    }

    private SentPaymentResponse toSentResponse(SentPayment s) {
        return new SentPaymentResponse(s.getId(), s.getRecipient(), s.getUpiId(), s.getAmount(),
                s.getNote(), s.getReference(), s.getMethod(), s.getSentOn().toString());
    }
}