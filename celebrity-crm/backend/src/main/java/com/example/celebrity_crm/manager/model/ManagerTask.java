package com.example.celebrity_crm.manager.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "manager_tasks")
public class ManagerTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String title;
    private LocalDate dueDate;
    private String assignee;
    private boolean done;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getAssignee() { return assignee; }
    public void setAssignee(String assignee) { this.assignee = assignee; }
    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
}