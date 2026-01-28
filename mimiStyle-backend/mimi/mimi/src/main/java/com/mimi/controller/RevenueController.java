package com.mimi.controller;

import com.mimi.dto.response.RevenueResponse;
import com.mimi.dto.response.SoldProductResponse;
import com.mimi.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/revenue")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    @GetMapping("/summary/{userId}")
    public ResponseEntity<RevenueResponse> getRevenueSummary(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category) {
        
        RevenueResponse revenue = revenueService.getRevenueSummary(userId, startDate, endDate, category);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/sold-products/{userId}")
    public ResponseEntity<List<SoldProductResponse>> getSoldProducts(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category) {
        
        List<SoldProductResponse> soldProducts = revenueService.getSoldProducts(userId, startDate, endDate, category);
        return ResponseEntity.ok(soldProducts);
    }
}