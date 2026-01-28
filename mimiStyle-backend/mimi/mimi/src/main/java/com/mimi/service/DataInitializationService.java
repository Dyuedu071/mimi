package com.mimi.service;

import com.mimi.domain.Category;
import com.mimi.domain.User;
import com.mimi.domain.enums.Role;
import com.mimi.repository.CategoryRepository;
import com.mimi.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DataInitializationService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @PostConstruct
    public void initializeData() {
        // Create default user if not exists
        if (userRepository.count() == 0) {
            User defaultUser = new User();
            defaultUser.setFullName("Admin User");
            defaultUser.setEmail("admin@mimi.com");
            defaultUser.setPassword("$2a$10$dummy.hash.for.demo"); // Dummy hash
            defaultUser.setRole(Role.ADMIN);
            userRepository.save(defaultUser);
        }

        // Create default categories if not exist
        if (categoryRepository.count() == 0) {
            String[] categoryNames = {
                "Đồ chơi", "Quần áo", "Giày dép", "Xe đẩy", 
                "Bình sữa", "Tã bỉm", "Sữa bột", "Nôi cũi",
                "Ghế ăn dặm", "Đồ dùng tắm"
            };

            for (String name : categoryNames) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);
            }
        }
    }
}