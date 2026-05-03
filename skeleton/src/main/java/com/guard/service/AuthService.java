package com.guard.service;

import com.guard.model.User;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;

/**
 * Authentication service for user login and JWT token generation.
 * Uses PBKDF2 for password hashing and SmallRye JWT for token generation.
 */
@ApplicationScoped
public class AuthService {

    private static final Logger LOG = Logger.getLogger(AuthService.class);
    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;

    @ConfigProperty(name = "mp.jwt.verify.issuer", defaultValue = "compliance-guard")
    String issuer;

    /**
     * Authenticate user and generate JWT token.
     *
     * @param email User email
     * @param password Plain text password
     * @return Optional containing User with token if authentication successful
     */
    public Optional<User> authenticate(String email, String password) {
        try {
            // Find user by email
            User user = User.findByEmailAndActive(email, true);
            if (user == null) {
                LOG.debugf("User not found: %s", email);
                return Optional.empty();
            }

            // Verify password
            if (!verifyPassword(password, user.passwordHash)) {
                LOG.debugf("Invalid password for user: %s", email);
                return Optional.empty();
            }

            // Generate JWT token
            String token = generateToken(user);
            
            // Create response user object (don't expose password hash)
            User responseUser = new User();
            responseUser.id = user.id;
            responseUser.email = user.email;
            responseUser.name = user.name;
            responseUser.role = user.role;
            
            LOG.infof("User authenticated successfully: %s", email);
            return Optional.of(responseUser);

        } catch (Exception e) {
            LOG.errorf(e, "Authentication error for user: %s", email);
            return Optional.empty();
        }
    }

    /**
     * Generate JWT token for authenticated user.
     *
     * @param user Authenticated user
     * @return JWT token string
     */
    public String generateToken(User user) {
        return Jwt.issuer(issuer)
                .upn(user.email)
                .groups(user.role.name())
                .claim("userId", user.id)
                .claim("name", user.name)
                .expiresIn(Duration.ofHours(8))
                .sign();
    }

    /**
     * Hash password using PBKDF2.
     *
     * @param password Plain text password
     * @return Base64 encoded hash with salt
     */
    public String hashPassword(String password) {
        try {
            // Generate random salt
            byte[] salt = new byte[16];
            new java.security.SecureRandom().nextBytes(salt);

            // Hash password
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = factory.generateSecret(spec).getEncoded();

            // Combine salt and hash
            byte[] combined = new byte[salt.length + hash.length];
            System.arraycopy(salt, 0, combined, 0, salt.length);
            System.arraycopy(hash, 0, combined, salt.length, hash.length);

            return Base64.getEncoder().encodeToString(combined);

        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    /**
     * Verify password against stored hash.
     *
     * @param password Plain text password
     * @param storedHash Base64 encoded hash with salt
     * @return true if password matches
     */
    public boolean verifyPassword(String password, String storedHash) {
        try {
            // Decode stored hash
            byte[] combined = Base64.getDecoder().decode(storedHash);

            // Extract salt and hash
            byte[] salt = Arrays.copyOfRange(combined, 0, 16);
            byte[] hash = Arrays.copyOfRange(combined, 16, combined.length);

            // Hash provided password with same salt
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] testHash = factory.generateSecret(spec).getEncoded();

            // Compare hashes
            return Arrays.equals(hash, testHash);

        } catch (Exception e) {
            LOG.error("Error verifying password", e);
            return false;
        }
    }

    /**
     * Create a new user with hashed password.
     *
     * @param email User email
     * @param password Plain text password
     * @param name User name
     * @param role User role
     * @return Created user
     */
    public User createUser(String email, String password, String name, User.Role role) {
        User user = new User();
        user.email = email;
        user.passwordHash = hashPassword(password);
        user.name = name;
        user.role = role;
        user.persist();
        
        LOG.infof("User created: %s", email);
        return user;
    }
}

// Made with Bob
