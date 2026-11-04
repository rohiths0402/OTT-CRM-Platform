package com.example.celebrity_crm.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class FirebaseClient {

    private final String apiKey;
    private final RestClient client = RestClient.create();

    public FirebaseClient(@Value("${app.firebase.api-key:}") String apiKey) {
        this.apiKey = apiKey;
    }

    // asks Google if the token is real and returns the verified phone number
    public String phoneFromToken(String idToken) {
        Map<?, ?> result = client.post()
                .uri("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("idToken", idToken))
                .retrieve()
                .body(Map.class);

        if (result == null || !(result.get("users") instanceof List<?> list) || list.isEmpty()) {
            return null;
        }
        Object phone = ((Map<?, ?>) list.get(0)).get("phoneNumber");
        return phone == null ? null : phone.toString();
    }
}