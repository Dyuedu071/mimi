package com.mimi.domain;

import com.mimi.domain.enums.OrderStatus;
import com.mimi.domain.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;
    
    @Column(name = "total_amount", precision = 19, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "shipping_fee", precision = 19, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;
    
    @Column(name = "discount_amount", precision = 19, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "final_amount", precision = 19, scale = 2, nullable = false)
    private BigDecimal finalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(name = "shipping_name", nullable = false)
    private String shippingName;
    
    @Column(name = "shipping_phone", nullable = false)
    private String shippingPhone;
    
    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;
    
    @Column(columnDefinition = "TEXT")
    private String note;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    // Relationships
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
}