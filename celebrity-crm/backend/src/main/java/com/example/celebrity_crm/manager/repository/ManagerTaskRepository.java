package com.example.celebrity_crm.manager.repository;

import com.example.celebrity_crm.manager.model.ManagerTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManagerTaskRepository extends JpaRepository<ManagerTask, Long> {

    List<ManagerTask> findByUserIdOrderByIdDesc(Long userId);
}