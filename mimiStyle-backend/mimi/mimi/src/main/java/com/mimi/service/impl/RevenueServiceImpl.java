package com.mimi.service.impl;

import com.mimi.domain.OrderItem;
import com.mimi.domain.ProductImage;
import com.mimi.dto.response.DailyRevenueResponse;
import com.mimi.dto.response.RevenueResponse;
import com.mimi.dto.response.SoldProductResponse;
import com.mimi.repository.OrderItemRepository;
import com.mimi.repository.ProductImageRepository;
import com.mimi.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueServiceImpl implements RevenueService {

    private final OrderItemRepository orderItemRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    @Transactional(readOnly = true)
    public RevenueResponse getRevenueSummary(Long userId, LocalDate startDate, LocalDate endDate, String category) {
        List<OrderItem> soldItems = getSoldItemsForSeller(userId, startDate, endDate, category);
        BigDecimal totalRevenue = soldItems.stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        Integer totalProductsSold = soldItems.stream()
            .mapToInt(OrderItem::getQuantity)
            .sum();
        String period = formatPeriod(startDate, endDate);
        return new RevenueResponse(totalRevenue, totalProductsSold, period);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SoldProductResponse> getSoldProducts(Long userId, LocalDate startDate, LocalDate endDate, String category) {
        List<OrderItem> soldItems = getSoldItemsForSeller(userId, startDate, endDate, category);
        return soldItems.stream()
            .map(this::mapToSoldProductResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DailyRevenueResponse> getDailyRevenue(Long userId, LocalDate startDate, LocalDate endDate) {
        List<OrderItem> soldItems = getSoldItemsForSeller(userId, startDate, endDate, null);
        
        Map<LocalDate, DailyRevenueResponse> dailyMap = new LinkedHashMap<>();
        
        for (OrderItem item : soldItems) {
            LocalDate date = item.getOrder().getCreatedAt().toLocalDate();
            DailyRevenueResponse daily = dailyMap.getOrDefault(date, 
                new DailyRevenueResponse(date, BigDecimal.ZERO, 0, 0));
            
            BigDecimal itemRevenue = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            daily.setRevenue(daily.getRevenue().add(itemRevenue));
            daily.setProductCount(daily.getProductCount() + item.getQuantity());
            
            dailyMap.put(date, daily);
        }
        
        // Count unique orders per day
        Map<LocalDate, Set<Long>> ordersPerDay = new HashMap<>();
        for (OrderItem item : soldItems) {
            LocalDate date = item.getOrder().getCreatedAt().toLocalDate();
            ordersPerDay.computeIfAbsent(date, k -> new HashSet<>()).add(item.getOrder().getId());
        }
        
        for (Map.Entry<LocalDate, Set<Long>> entry : ordersPerDay.entrySet()) {
            DailyRevenueResponse daily = dailyMap.get(entry.getKey());
            if (daily != null) {
                daily.setOrderCount(entry.getValue().size());
            }
        }
        
        return dailyMap.values().stream()
            .sorted(Comparator.comparing(DailyRevenueResponse::getDate))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DailyRevenueResponse> getWeeklyRevenue(Long userId, LocalDate startDate, LocalDate endDate) {
        List<OrderItem> soldItems = getSoldItemsForSeller(userId, startDate, endDate, null);
        
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        Map<String, DailyRevenueResponse> weeklyMap = new LinkedHashMap<>();
        
        for (OrderItem item : soldItems) {
            LocalDate date = item.getOrder().getCreatedAt().toLocalDate();
            int year = date.getYear();
            int week = date.get(weekFields.weekOfWeekBasedYear());
            String weekKey = year + "-W" + String.format("%02d", week);
            
            // Use Monday of the week as the date
            LocalDate weekStart = date.with(weekFields.dayOfWeek(), 1);
            
            DailyRevenueResponse weekly = weeklyMap.getOrDefault(weekKey, 
                new DailyRevenueResponse(weekStart, BigDecimal.ZERO, 0, 0));
            
            BigDecimal itemRevenue = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            weekly.setRevenue(weekly.getRevenue().add(itemRevenue));
            weekly.setProductCount(weekly.getProductCount() + item.getQuantity());
            
            weeklyMap.put(weekKey, weekly);
        }
        
        // Count unique orders per week
        Map<String, Set<Long>> ordersPerWeek = new HashMap<>();
        for (OrderItem item : soldItems) {
            LocalDate date = item.getOrder().getCreatedAt().toLocalDate();
            int year = date.getYear();
            int week = date.get(weekFields.weekOfWeekBasedYear());
            String weekKey = year + "-W" + String.format("%02d", week);
            ordersPerWeek.computeIfAbsent(weekKey, k -> new HashSet<>()).add(item.getOrder().getId());
        }
        
        for (Map.Entry<String, Set<Long>> entry : ordersPerWeek.entrySet()) {
            DailyRevenueResponse weekly = weeklyMap.get(entry.getKey());
            if (weekly != null) {
                weekly.setOrderCount(entry.getValue().size());
            }
        }
        
        return weeklyMap.values().stream()
            .sorted(Comparator.comparing(DailyRevenueResponse::getDate))
            .collect(Collectors.toList());
    }

    /** Lấy order items của seller: không lọc ngày khi startDate/endDate đều null (lấy tất cả đơn đã bán). */
    private List<OrderItem> getSoldItemsForSeller(Long userId, LocalDate startDate, LocalDate endDate, String category) {
        List<OrderItem> soldItems;
        if (startDate == null && endDate == null) {
            soldItems = orderItemRepository.findAllSoldItemsBySeller(userId);
        } else {
            LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
            LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;
            soldItems = orderItemRepository.findSoldItemsBySeller(userId, startDateTime, endDateTime);
        }
        if (category != null && !category.isEmpty()) {
            soldItems = soldItems.stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getCategory() != null
                    && category.equalsIgnoreCase(item.getProduct().getCategory().getName()))
                .collect(Collectors.toList());
        }
        return soldItems;
    }
    
    private SoldProductResponse mapToSoldProductResponse(OrderItem orderItem) {
        String imageUrl = null;
        if (orderItem.getProduct() != null) {
            List<ProductImage> imgs = productImageRepository.findByProductId(orderItem.getProduct().getId());
            if (imgs != null && !imgs.isEmpty()) {
                imageUrl = imgs.get(0).getImageUrl();
            }
        }
        if (imageUrl == null) imageUrl = "";
            
        String categoryName = orderItem.getProduct().getCategory() != null 
            ? orderItem.getProduct().getCategory().getName()
            : "Khác";
            
        BigDecimal totalAmount = orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
        
        var order = orderItem.getOrder();
        return new SoldProductResponse(
            orderItem.getProduct().getId(),
            orderItem.getProduct().getName(),
            imageUrl,
            orderItem.getQuantity(),
            totalAmount,
            order.getCreatedAt().toLocalDate(),
            categoryName,
            order.getId(),
            order.getStatus() != null ? order.getStatus().name() : "PENDING",
            order.getShippingName() != null ? order.getShippingName() : "",
            order.getShippingPhone() != null ? order.getShippingPhone() : "",
            order.getShippingAddress() != null ? order.getShippingAddress() : "",
            order.getNote() != null ? order.getNote() : ""
        );
    }
    
    private String formatPeriod(LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return "Tất cả thời gian";
        }
        
        String start = startDate != null ? startDate.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "Bắt đầu";
        String end = endDate != null ? endDate.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "Hiện tại";
        
        return start + " - " + end;
    }
}