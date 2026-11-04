package com.example.celebrity_crm.manager.repository;

import com.example.celebrity_crm.manager.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByUserIdOrderByIdDesc(Long userId);
}