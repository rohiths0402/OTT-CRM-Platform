package com.example.celebrity_crm.contract.repository;

import com.example.celebrity_crm.contract.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByUserIdAndStatusOrderByDueDate(Long userId, String status);

    List<Contract> findByUserIdOrderByIdDesc(Long userId);
}