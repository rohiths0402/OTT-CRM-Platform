package com.example.celebrity_crm.config;

import com.example.celebrity_crm.auth.StaffUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class CurrentUser {

    private final StaffUserRepository users;

    public CurrentUser(StaffUserRepository users) {
        this.users = users;
    }

    public Long id(Authentication authentication) {
        return users.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in."))
                .getId();
    }
}