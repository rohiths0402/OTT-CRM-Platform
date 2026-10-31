package com.example.celebrity_crm.contract.service;

import com.example.celebrity_crm.contract.dto.ContractRequest;
import com.example.celebrity_crm.contract.dto.ContractResponse;
import com.example.celebrity_crm.contract.dto.SignRequest;
import com.example.celebrity_crm.contract.model.Contract;
import com.example.celebrity_crm.contract.repository.ContractRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class ContractService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    private final ContractRepository repository;

    public ContractService(ContractRepository repository) {
        this.repository = repository;
    }

    public List<ContractResponse> list(Long userId) {
        return repository.findByUserIdOrderByIdDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ContractResponse add(Long userId, ContractRequest request) {
        Contract contract = new Contract();
        contract.setUserId(userId);
        contract.setStatus("Draft");
        contract.setType("New agreement");
        contract.setTerms("Terms to be added");
        contract.setActionNote("Add the agreement terms before sending for review.");
        fill(contract, request);
        return toResponse(repository.save(contract));
    }

    public ContractResponse update(Long userId, Long id, ContractRequest request) {
        Contract contract = find(userId, id);
        fill(contract, request);
        return toResponse(repository.save(contract));
    }

    public ContractResponse sign(Long userId, Long id, SignRequest request) {
        Contract contract = find(userId, id);
        if ("Signed".equals(contract.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This contract is already signed.");
        }
        contract.setStatus("Signed");
        contract.setSignedBy(request.signer().trim());
        contract.setSignatureData(request.signatureData());
        contract.setSignedAt(LocalDate.now());
        contract.setUpdatedOn(LocalDate.now());
        contract.setActionNote("A signed copy is ready in your project records.");
        return toResponse(repository.save(contract));
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
        contract.setTitle(request.title().trim());
        contract.setParty(request.counterparty().trim());
        contract.setAmount(request.value());
        if (request.type() != null && !request.type().isBlank()) {
            contract.setType(request.type());
        }
        if (request.terms() != null && !request.terms().isBlank()) {
            contract.setTerms(request.terms());
        }
        if (request.expiry() != null) {
            contract.setDueDate(request.expiry());
        }
        contract.setUpdatedOn(LocalDate.now());
    }

    private ContractResponse toResponse(Contract c) {
        return new ContractResponse(c.getId(), c.getTitle(), c.getParty(), c.getType(), c.getStatus(),
                c.getAmount(), updatedText(c), c.getDueDate() == null ? "Not set" : c.getDueDate().format(DATE),
                c.getTerms(), c.getActionNote(), c.getSignedBy(),
                c.getSignedAt() == null ? null : c.getSignedAt().format(DATE), c.getSignatureData());
    }

    private String updatedText(Contract c) {
        LocalDate on = c.getUpdatedOn() == null ? LocalDate.now() : c.getUpdatedOn();
        String day = on.format(DATE);
        return switch (c.getStatus()) {
            case "Signed" -> "Signed " + day;
            case "Draft" -> "Draft created " + day;
            case "Awaiting signature" -> "Sent " + day;
            default -> "Updated " + day;
        };
    }
}