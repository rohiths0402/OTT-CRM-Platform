package com.example.celebrity_crm.profile.repository;

import com.example.celebrity_crm.profile.model.ProfilePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfilePhotoRepository extends JpaRepository<ProfilePhoto, Long> {

    Optional<ProfilePhoto> findByUserId(Long userId);
}