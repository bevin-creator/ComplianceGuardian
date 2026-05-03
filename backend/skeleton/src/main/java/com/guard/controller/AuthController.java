package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.entity.User;
import com.guard.repository.UserRepository;
// import io.smallrye.jwt.build.Jwt; // Commented out to avoid JWT initialization in dev mode
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.logging.Logger;

import java.time.Instant;
// import java.time.Duration;
// import java.util.HashSet;
// import java.util.Set;
import java.util.UUID;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

    private static final Logger LOG = Logger.getLogger(AuthController.class);

    @Inject
    UserRepository userRepository;

    @POST
    @Path("/login")
    @Transactional
    public ApiResponse<LoginResponse> login(LoginRequest request) {
        // Validate input
        if (request.username == null || request.username.isEmpty()) {
            return ApiResponse.error("Username is required");
        }
        if (request.password == null || request.password.isEmpty()) {
            return ApiResponse.error("Password is required");
        }

        // Find user
        User user = userRepository.findByUsername(request.username);
        if (user == null) {
            return ApiResponse.error("Invalid username or password");
        }

        // Check if user is active
        if (!user.active) {
            return ApiResponse.error("Account is disabled");
        }

        // TODO: Implement proper password hashing (BCrypt)
        // For now, simple comparison (INSECURE - for development only)
        if (!user.password.equals(request.password)) {
            return ApiResponse.error("Invalid username or password");
        }

        // Update last login
        user.lastLogin = Instant.now();
        userRepository.persist(user);

        // Generate token (dev mode uses simple token, prod uses JWT)
        String token = generateDevToken(user);
        
        LOG.infof("✅ Login successful - Username: %s, Role: %s", user.username, user.role);

        // Create response
        LoginResponse response = new LoginResponse();
        response.token = token;
        response.user = new UserInfo();
        response.user.id = user.id;
        response.user.username = user.username;
        response.user.email = user.email;
        response.user.role = user.role;
        response.user.fullName = user.fullName;

        return ApiResponse.success(response, "Login successful");
    }

    @POST
    @Path("/logout")
    public ApiResponse<Void> logout() {
        // In JWT, logout is typically handled client-side by removing the token
        // Server-side logout would require token blacklisting (not implemented yet)
        return ApiResponse.success(null, "Logout successful");
    }

    @POST
    @Path("/register")
    @Transactional
    public ApiResponse<User> register(RegisterRequest request) {
        LOG.infof("📥 Registration attempt - Username: %s, Email: %s", request.username, request.email);
        
        // Validate input
        if (request.username == null || request.username.isEmpty()) {
            LOG.warn("Registration failed: Username is required");
            return ApiResponse.error("Username is required");
        }
        if (request.email == null || request.email.isEmpty()) {
            LOG.warn("Registration failed: Email is required");
            return ApiResponse.error("Email is required");
        }
        if (request.password == null || request.password.isEmpty()) {
            LOG.warn("Registration failed: Password is required");
            return ApiResponse.error("Password is required");
        }

        // Check if username exists
        if (userRepository.existsByUsername(request.username)) {
            LOG.warnf("Registration failed: Username '%s' already exists", request.username);
            return ApiResponse.error("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.email)) {
            LOG.warnf("Registration failed: Email '%s' already exists", request.email);
            return ApiResponse.error("Email already exists");
        }

        // Create new user
        User user = new User();
        user.id = UUID.randomUUID().toString();
        user.username = request.username;
        user.email = request.email;
        user.password = request.password; // TODO: Hash password with BCrypt
        user.fullName = request.name != null ? request.name : request.username;
        user.role = request.role != null ? request.role : "analyst";
        user.active = true;
        user.createdAt = Instant.now();
        user.updatedAt = Instant.now();

        userRepository.persist(user);
        
        LOG.infof("✅ User registered successfully - ID: %s, Username: %s, Email: %s, Role: %s",
                  user.id, user.username, user.email, user.role);

        // Don't return password in response
        user.password = null;

        return ApiResponse.success(user, "User registered successfully");
    }

    @GET
    @Path("/me")
    public ApiResponse<UserInfo> getCurrentUser() {
        // TODO: Extract user from JWT token in security context
        // For now, return mock response
        UserInfo userInfo = new UserInfo();
        userInfo.id = "user-1";
        userInfo.username = "admin";
        userInfo.email = "admin@complianceguard.com";
        userInfo.role = "admin";
        userInfo.fullName = "System Administrator";

        return ApiResponse.success(userInfo);
    }

    /**
     * Generate a simple development token (no JWT signing to avoid security component initialization)
     * In production, uncomment generateJwtToken() and use proper JWT signing
     */
    private String generateDevToken(User user) {
        // Simple token format: dev-{username}-{timestamp}-{userId}
        return String.format("dev-%s-%d-%s", user.username, System.currentTimeMillis(), user.id);
    }

    /**
     * Production JWT token generation (commented out for dev mode)
     * Uncomment this method and update generateDevToken() call to use this in production
     */
    /*
    private String generateJwtToken(User user) {
        try {
            Set<String> roles = new HashSet<>();
            roles.add(user.role);

            return Jwt.issuer("https://complianceguard.com")
                    .upn(user.username)
                    .groups(roles)
                    .claim("userId", user.id)
                    .claim("email", user.email)
                    .claim("fullName", user.fullName)
                    .expiresIn(Duration.ofHours(24))
                    .sign();
        } catch (Exception e) {
            LOG.error("JWT token generation failed", e);
            throw new RuntimeException("Failed to generate authentication token");
        }
    }
    */

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class LoginResponse {
        public String token;
        public UserInfo user;
    }

    public static class RegisterRequest {
        public String username;
        public String email;
        public String password;
        public String name;
        public String role;
    }

    public static class UserInfo {
        public String id;
        public String username;
        public String email;
        public String role;
        public String fullName;
    }
}

// Made with Bob
