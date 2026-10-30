package com.example.celebrity_crm.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Component
public class GoogleClient {

    @Value("${app.google.client-id}")
    private String clientId;

    @Value("${app.google.client-secret}")
    private String clientSecret;

    private final RestClient rest = RestClient.create();

    // trades the code from the frontend for the user's verified email
    public String emailFor(String code) {
        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("code", code);
            form.add("client_id", clientId);
            form.add("client_secret", clientSecret);
            form.add("redirect_uri", "postmessage");
            form.add("grant_type", "authorization_code");

            Map<?, ?> token = rest.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(Map.class);

            if (token == null || token.get("access_token") == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google sign in failed. Try again.");
            }

            Map<?, ?> info = rest.get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .header("Authorization", "Bearer " + token.get("access_token"))
                    .retrieve()
                    .body(Map.class);

            if (info == null || info.get("email") == null || !Boolean.TRUE.equals(info.get("email_verified"))) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google sign in failed. Try again.");
            }
            return (String) info.get("email");
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google sign in failed. Try again.");
        }
    }
}