package com.example.celebrity_crm.project.repository;

import com.example.celebrity_crm.project.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProjectIdIn(Collection<Long> projectIds);

    void deleteByProjectId(Long projectId);
}