package com.example.celebrity_crm.contract.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String title;
    private String party;
    private String type;
    private String status;
    private long amount;
    private LocalDate dueDate;
    private LocalDate updatedOn = LocalDate.now();

    @Column(length = 500)
    private String terms;

    @Column(length = 500)
    private String actionNote;

    private String signedBy;
    private LocalDate signedAt;

    @Column(columnDefinition = "LONGTEXT")
    private String signatureData;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getParty() { return party; }
    public void setParty(String party) { this.party = party; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public long getAmount() { return amount; }
    public void setAmount(long amount) { this.amount = amount; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public LocalDate getUpdatedOn() { return updatedOn; }
    public void setUpdatedOn(LocalDate updatedOn) { this.updatedOn = updatedOn; }
    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }
    public String getActionNote() { return actionNote; }
    public void setActionNote(String actionNote) { this.actionNote = actionNote; }
    public String getSignedBy() { return signedBy; }
    public void setSignedBy(String signedBy) { this.signedBy = signedBy; }
    public LocalDate getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDate signedAt) { this.signedAt = signedAt; }
    public String getSignatureData() { return signatureData; }
    public void setSignatureData(String signatureData) { this.signatureData = signatureData; }
}