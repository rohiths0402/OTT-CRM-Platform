package com.example.celebrity_crm.payment.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "sent_payments")
public class SentPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String recipient;
    private String upiId;
    private long amount;
    private String note;
    private String reference;
    private String method = "UPI";
    private LocalDate sentOn = LocalDate.now();

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public long getAmount() { return amount; }
    public void setAmount(long amount) { this.amount = amount; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    public LocalDate getSentOn() { return sentOn; }
    public void setSentOn(LocalDate sentOn) { this.sentOn = sentOn; }
}