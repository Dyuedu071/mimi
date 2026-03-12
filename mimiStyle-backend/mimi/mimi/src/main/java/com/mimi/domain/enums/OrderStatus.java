package com.mimi.domain.enums;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPING,
    COMPLETED,
    CANCELLED,
    RENTING,      // Đang thuê
    RETURNED,     // Đã trả hàng
    OVERDUE       // Quá hạn trả
}