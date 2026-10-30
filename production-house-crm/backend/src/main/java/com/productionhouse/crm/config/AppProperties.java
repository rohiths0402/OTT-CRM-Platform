package com.productionhouse.crm.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Otp otp, Mail mail, Cors cors) {

    public record Jwt(String secret, long expirationMinutes, long rememberMeExpirationDays) {
    }

    public record Otp(int length, long expiryMinutes, int maxAttempts, long resendCooldownSeconds) {
    }

    public record Mail(String from, String fromName) {
    }

    public record Cors(List<String> allowedOrigins) {
    }
}
