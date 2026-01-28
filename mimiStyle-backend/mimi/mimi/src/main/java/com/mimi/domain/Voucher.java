package com.mimi.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(name = "discount_value", precision = 19, scale = 2, nullable = false)
    private BigDecimal discountValue;
    
    @Column(name = "min_order_value", precision = 19, scale = 2)
    private BigDecimal minOrderValue;
    
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
}