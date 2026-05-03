package com.guard.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;

/**
 * User entity for authentication and authorization.
 * Uses Panache for simplified database operations.
 */
@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @Column(unique = true, nullable = false)
    public String email;

    @Column(nullable = false)
    public String passwordHash;

    @Column(nullable = false)
    public String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Role role;

    @Column(nullable = false)
    public boolean active = true;

    @Column(nullable = false)
    public Instant createdAt = Instant.now();

    @Column(nullable = false)
    public Instant updatedAt = Instant.now();

    public enum Role {
        EXECUTIVE,
        ANALYST,
        COMPLIANCE_OFFICER,
        ADMIN
    }

    // Panache finder methods
    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }

    public static User findByEmailAndActive(String email, boolean active) {
        return find("email = ?1 and active = ?2", email, active).firstResult();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}

// Made with Bob
