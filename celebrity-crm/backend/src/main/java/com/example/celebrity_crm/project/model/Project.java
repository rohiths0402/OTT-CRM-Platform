package com.example.celebrity_crm.project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String title;
    private String type;
    private String role;
    private String company;
    private String director;
    private String status;
    private String phase;
    private int progress;
    private String progressLabel;
    private String releaseLabel;
    private long moneyTotal;
    private long moneyReceived;
    private String nextPayment;
    private String contractStatus;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPhase() { return phase; }
    public void setPhase(String phase) { this.phase = phase; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public String getProgressLabel() { return progressLabel; }
    public void setProgressLabel(String progressLabel) { this.progressLabel = progressLabel; }
    public String getReleaseLabel() { return releaseLabel; }
    public void setReleaseLabel(String releaseLabel) { this.releaseLabel = releaseLabel; }
    public long getMoneyTotal() { return moneyTotal; }
    public void setMoneyTotal(long moneyTotal) { this.moneyTotal = moneyTotal; }
    public long getMoneyReceived() { return moneyReceived; }
    public void setMoneyReceived(long moneyReceived) { this.moneyReceived = moneyReceived; }
    public String getNextPayment() { return nextPayment; }
    public void setNextPayment(String nextPayment) { this.nextPayment = nextPayment; }
    public String getContractStatus() { return contractStatus; }
    public void setContractStatus(String contractStatus) { this.contractStatus = contractStatus; }
}