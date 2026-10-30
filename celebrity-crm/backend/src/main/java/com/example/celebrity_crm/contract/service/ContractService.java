package com.example.celebrity_crm.contract.service;

import com.example.celebrity_crm.contract.dto.ContractRequest;
import com.example.celebrity_crm.contract.model.Contract;
import com.example.celebrity_crm.contract.repository.ContractRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ContractService {

    private final ContractRepository repository;

    public ContractService(ContractRepository repository) {
        this.repository = repository;
    }

    public List<Contract> list(Long userId) {
        return repository.findByUserIdOrderByIdDesc(userId);
    }

    public Contract add(Long userId, ContractRequest request) {
        Contract contract = new Contract();
        contract.setUserId(userId);
        contract.setStatus("PENDING");
        fill(contract, request);
        return repository.save(contract);
    }

    public Contract update(Long userId, Long id, ContractRequest request) {
        Contract contract = find(userId, id);
        fill(contract, request);
        return repository.save(contract);
    }

    public Contract sign(Long userId, Long id) {
        Contract contract = find(userId, id);
        contract.setStatus("SIGNED");
        return repository.save(contract);
    }

    public void delete(Long userId, Long id) {
        repository.delete(find(userId, id));
    }

    private Contract find(Long userId, Long id) {
        return repository.findById(id)
                .filter(c -> c.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found."));
    }

    private void fill(Contract contract, ContractRequest request) {
        contract.setTitle(request.title());
        contract.setParty(request.party());
        contract.setDueDate(request.dueDate());
    }
}