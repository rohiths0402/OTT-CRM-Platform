package com.example.celebrity_crm.contract.repository;

import com.example.celebrity_crm.contract.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByUserIdAndStatusInOrderByDueDate(Long userId, Collection<String> statuses);

    List<Contract> findByUserIdOrderByIdDesc(Long userId);
}