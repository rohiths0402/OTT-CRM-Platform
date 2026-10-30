package com.example.celebrity_crm.profile.service;

import com.example.celebrity_crm.profile.dto.ProfileRequest;
import com.example.celebrity_crm.profile.model.CelebrityProfile;
import com.example.celebrity_crm.profile.repository.CelebrityProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final CelebrityProfileRepository repository;

    public ProfileService(CelebrityProfileRepository repository) {
        this.repository = repository;
    }

    public CelebrityProfile get(Long userId) {
        return repository.findByUserId(userId).orElseGet(CelebrityProfile::new);
    }

    public CelebrityProfile save(Long userId, ProfileRequest request) {
        CelebrityProfile profile = repository.findByUserId(userId).orElseGet(CelebrityProfile::new);
        profile.setUserId(userId);
        profile.setRoleTitle(request.roleTitle());
        profile.setImageUrl(request.imageUrl());
        profile.setManagerName(request.managerName());
        profile.setManagerPhone(request.managerPhone());
        return repository.save(profile);
    }
}