package com.example.celebrity_crm.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffUserRepository extends JpaRepository<StaffUser, Long> {

    Optional<StaffUser> findByEmail(String email);

    Optional<StaffUser> findByMobile(String mobile);
}