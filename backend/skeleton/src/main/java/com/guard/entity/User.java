package com.guard.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    public String username;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    public String email;

    @NotBlank
    @Column(nullable = false)
    public String password; // Hashed password

    @NotBlank
    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public String role = "ANALYST"; // ADMIN, ANALYST, VIEWER

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();

    @Column(name = "last_login")
    public Instant lastLogin;

    @Column(nullable = false)
    public Boolean active = true;
}

// Made with Bob
