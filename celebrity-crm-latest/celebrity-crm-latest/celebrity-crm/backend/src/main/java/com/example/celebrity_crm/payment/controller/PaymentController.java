package com.example.celebrity_crm.payment.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.payment.dto.PaymentResponse;
import com.example.celebrity_crm.payment.dto.RazorpayOrderRequest;
import com.example.celebrity_crm.payment.dto.RazorpayOrderResponse;
import com.example.celebrity_crm.payment.dto.RazorpayVerifyRequest;
import com.example.celebrity_crm.payment.dto.SentPaymentRequest;
import com.example.celebrity_crm.payment.dto.SentPaymentResponse;
import com.example.celebrity_crm.payment.dto.SentVerifyRequest;
import com.example.celebrity_crm.payment.dto.SettleRequest;
import com.example.celebrity_crm.payment.service.PaymentService;
import com.example.celebrity_crm.payment.service.RazorpayService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;
    private final RazorpayService razorpay;
    private final CurrentUser currentUser;

    public PaymentController(PaymentService service, RazorpayService razorpay, CurrentUser currentUser) {
        this.service = service;
        this.razorpay = razorpay;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<PaymentResponse> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PutMapping("/{id}/settle")
    public PaymentResponse settle(Authentication authentication, @PathVariable Long id,
                                  @Valid @RequestBody SettleRequest request) {
        return service.settle(currentUser.id(authentication), id, request);
    }

    @PostMapping("/{id}/razorpay/order")
    public RazorpayOrderResponse createOrder(Authentication authentication, @PathVariable Long id,
                                             @Valid @RequestBody RazorpayOrderRequest request) {
        return razorpay.createOrder(currentUser.id(authentication), id, request.amount());
    }

    @PostMapping("/{id}/razorpay/verify")
    public PaymentResponse verify(Authentication authentication, @PathVariable Long id,
                                  @Valid @RequestBody RazorpayVerifyRequest request) {
        return razorpay.verify(currentUser.id(authentication), id, request);
    }

    @GetMapping("/sent")
    public List<SentPaymentResponse> sentList(Authentication authentication) {
        return service.sentList(currentUser.id(authentication));
    }

    @PostMapping("/sent")
    public SentPaymentResponse addSent(Authentication authentication,
                                       @Valid @RequestBody SentPaymentRequest request) {
        return service.addSent(currentUser.id(authentication), request);
    }

    @PostMapping("/sent/razorpay/order")
    public RazorpayOrderResponse createSentOrder(Authentication authentication,
                                                 @Valid @RequestBody RazorpayOrderRequest request) {
        return razorpay.createSentOrder(currentUser.id(authentication), request.amount());
    }

    @PostMapping("/sent/razorpay/verify")
    public SentPaymentResponse verifySent(Authentication authentication,
                                          @Valid @RequestBody SentVerifyRequest request) {
        return razorpay.verifySent(currentUser.id(authentication), request);
    }
}