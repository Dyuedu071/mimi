package com.mimi.service;

import com.mimi.dto.response.RevenueResponse;
import com.mimi.dto.response.SoldProductResponse;

import java.time.LocalDate;
import java.util.List;

public interface RevenueService {
    RevenueResponse getRevenueSummary(Long userId, LocalDate startDate, LocalDate endDate, String category);
    List<SoldProductResponse> getSoldProducts(Long userId, LocalDate startDate, LocalDate endDate, String category);
}