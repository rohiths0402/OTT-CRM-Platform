package com.productionhouse.crm.dto;

import com.productionhouse.crm.entity.User;
import java.time.Instant;

public record UserResponse(Long id, String fullName, String company, String email, String mobile, Instant createdAt) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getCompany(),
                user.getEmail(), user.getMobile(), user.getCreatedAt());
    }
}
