package com.mimi.domain;

import com.mimi.domain.enums.BabyStatus;
import com.mimi.domain.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "baby_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BabyProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String name;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    private Gender gender = Gender.UNKNOWN;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BabyStatus status;
}