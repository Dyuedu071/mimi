package com.mimi.service;

import com.mimi.domain.Category;
import com.mimi.domain.User;
import com.mimi.domain.Voucher;
import com.mimi.domain.enums.Role;
import com.mimi.repository.CategoryRepository;
import com.mimi.repository.ProductRepository;
import com.mimi.repository.UserRepository;
import com.mimi.repository.VoucherRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DataInitializationService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initializeData() {
        // Create default user if not exists
        if (userRepository.count() == 0) {
            User defaultUser = new User();
            defaultUser.setUsername("admin");
            defaultUser.setFullName("Admin User");
            defaultUser.setEmail("admin@mimi.com");
            defaultUser.setPassword("$2a$10$WtfQ7DJDfsVo7Xeg3cdIr.3pm4XXfdZXut5bQ91KKY/UOzWvZA8sW");
            defaultUser.setRole(Role.ADMIN);
            userRepository.save(defaultUser);
        }

        // Create default categories if not exist
        if (categoryRepository.count() == 0) {
            String[] categoryNames = {
                "Ð? choi", "Qu?n áo", "Giày dép", "Xe d?y", 
                "Bình s?a", "Tã b?m", "S?a b?t", "Nôi cui",
                "Gh? an d?m", "Ð? dùng t?m"
            };
            
            for (String name : categoryNames) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);
            }
        }

        // Create default vouchers if not exist
        if (voucherRepository.count() == 0) {
            Voucher v1 = new Voucher();
            v1.setCode("WELCOME");
            v1.setDiscountValue(new BigDecimal("50000"));
            v1.setMinOrderValue(new BigDecimal("200000"));
            v1.setExpirationDate(LocalDateTime.now().plusMonths(3));
            voucherRepository.save(v1);

            Voucher v2 = new Voucher();
            v2.setCode("FREESHIP");
            v2.setDiscountValue(new BigDecimal("30000"));
            v2.setMinOrderValue(new BigDecimal("300000"));
            v2.setExpirationDate(LocalDateTime.now().plusMonths(1));
            voucherRepository.save(v2);

            Voucher v3 = new Voucher();
            v3.setCode("TET2025");
            v3.setDiscountValue(new BigDecimal("100000"));
            v3.setMinOrderValue(new BigDecimal("500000"));
            v3.setExpirationDate(LocalDateTime.now().plusMonths(6));
            voucherRepository.save(v3);
        }
    }
}
