package com.example.celebrity_crm.profile.repository;

import com.example.celebrity_crm.profile.model.CelebrityProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CelebrityProfileRepository extends JpaRepository<CelebrityProfile, Long> {

    Optional<CelebrityProfile> findByUserId(Long userId);
}