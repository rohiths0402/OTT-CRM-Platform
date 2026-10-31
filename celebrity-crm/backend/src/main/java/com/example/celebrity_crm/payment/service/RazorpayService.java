package com.example.celebrity_crm.payment.service;

import com.example.celebrity_crm.payment.dto.PaymentResponse;
import com.example.celebrity_crm.payment.dto.RazorpayOrderResponse;
import com.example.celebrity_crm.payment.dto.RazorpayVerifyRequest;
import com.example.celebrity_crm.payment.dto.SentPaymentRequest;
import com.example.celebrity_crm.payment.dto.SentPaymentResponse;
import com.example.celebrity_crm.payment.dto.SentVerifyRequest;
import com.example.celebrity_crm.payment.dto.SettleRequest;
import com.example.celebrity_crm.payment.model.Payment;
import com.example.celebrity_crm.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RazorpayService {

    private record PendingOrder(Long paymentId, long amount) {
    }

    private final PaymentRepository payments;
    private final PaymentService paymentService;
    private final String keyId;
    private final String keySecret;
    private final RestClient client = RestClient.create();
    private final Map<String, PendingOrder> orders = new ConcurrentHashMap<>();

    public RazorpayService(PaymentRepository payments, PaymentService paymentService,
                           @Value("${razorpay.key-id}") String keyId,
                           @Value("${razorpay.key-secret}") String keySecret) {
        this.payments = payments;
        this.paymentService = paymentService;
        this.keyId = keyId;
        this.keySecret = keySecret;
    }

    public RazorpayOrderResponse createOrder(Long userId, Long paymentId, long amount) {
        Payment payment = payments.findById(paymentId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found."));

        long remaining = payment.getAmount() - payment.getReceivedAmount();
        if ("received".equals(payment.getStatus()) || amount > remaining) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The amount is more than the balance.");
        }

        String orderId = newOrder(amount, "pay_" + paymentId);
        orders.put(orderId, new PendingOrder(paymentId, amount));
        return new RazorpayOrderResponse(orderId, keyId, amount * 100, "INR");
    }

    public PaymentResponse verify(Long userId, Long paymentId, RazorpayVerifyRequest request) {
        PendingOrder order = orders.get(request.orderId());
        if (order == null || !paymentId.equals(order.paymentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This payment order was not found.");
        }
        checkSignature(request.orderId(), request.paymentId(), request.signature());

        orders.remove(request.orderId());
        return paymentService.settle(userId, paymentId,
                new SettleRequest(order.amount(), "Razorpay", request.paymentId()));
    }

    public RazorpayOrderResponse createSentOrder(Long userId, long amount) {
        String orderId = newOrder(amount, "sent_" + userId + "_" + System.currentTimeMillis());
        orders.put(orderId, new PendingOrder(null, amount));
        return new RazorpayOrderResponse(orderId, keyId, amount * 100, "INR");
    }

    public SentPaymentResponse verifySent(Long userId, SentVerifyRequest request) {
        PendingOrder order = orders.get(request.orderId());
        if (order == null || order.paymentId() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This payment order was not found.");
        }
        checkSignature(request.orderId(), request.paymentId(), request.signature());

        orders.remove(request.orderId());
        return paymentService.addSent(userId, new SentPaymentRequest(
                request.recipient(), request.upiId(), order.amount(), request.note(), request.paymentId()));
    }

    private String newOrder(long amount, String receipt) {
        Map<String, Object> body = Map.of(
                "amount", amount * 100,
                "currency", "INR",
                "receipt", receipt);

        try {
            Map<?, ?> result = client.post()
                    .uri("https://api.razorpay.com/v1/orders")
                    .headers(headers -> headers.setBasicAuth(keyId, keySecret))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            return String.valueOf(result.get("id"));
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Could not create the Razorpay order.");
        }
    }

    private void checkSignature(String orderId, String paymentId, String signature) {
        String expected = sign(orderId + "|" + paymentId);
        boolean same = MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8));
        if (!same) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The payment could not be verified.");
        }
    }

    private String sign(String text) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(text.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Could not sign the payment.", e);
        }
    }
}