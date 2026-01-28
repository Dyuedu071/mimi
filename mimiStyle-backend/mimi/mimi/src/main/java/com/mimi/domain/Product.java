package com.mimi.domain;

import com.mimi.domain.enums.ProductStatus;
import com.mimi.domain.enums.RentUnit;
import com.mimi.domain.enums.TradeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "condition_percentage")
    private Integer conditionPercentage;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "trade_type", nullable = false)
    private TradeType tradeType;
    
    @Column(name = "buy_price", precision = 19, scale = 2)
    private BigDecimal buyPrice;
    
    @Column(name = "rent_price", precision = 19, scale = 2)
    private BigDecimal rentPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "rent_unit")
    private RentUnit rentUnit;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.ACTIVE;
    
    @Column(name = "address_contact")
    private String addressContact;
    
    // Relationships
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductCertificate> certificates;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
}