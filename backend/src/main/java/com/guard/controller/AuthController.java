package com.guard.controller;

import com.guard.dto.ApiResponse;
import com.guard.entity.User;
import com.guard.repository.UserRepository;
import io.smallrye.jwt.build.Jwt;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jboss.logging.Logger;

import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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
        if (request.username == null || request.username.isEmpty()) {
            return ApiResponse.error("Username is required");
        }
        if (request.password == null || request.password.isEmpty()) {
            return ApiResponse.error("Password is required");
        }

        Optional<User> userOpt = userRepository.findByUsername(request.username);
        if (userOpt.isEmpty()) {
            return ApiResponse.error("Invalid username or password");
        }

        User user = userOpt.get();
        
        if (!user.active) {
            return ApiResponse.error("Account is disabled");
        }

        // TODO: Implement proper password hashing (BCrypt)
        if (!user.password.equals(request.password)) {
            return ApiResponse.error("Invalid username or password");
        }

        user.lastLogin = Instant.now();
        userRepository.persist(user);

        String token = generateToken(user);

        LoginResponse response = new LoginResponse();
        response.token = token;
        response.user = new UserInfo();
        response.user.id = user.id.toString();
        response.user.username = user.username;
        response.user.email = user.email;
        response.user.role = user.role;
        response.user.name = user.name;

        return ApiResponse.success(response, "Login successful");
    }

    @POST
    @Path("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.success(null, "Logout successful");
    }

    @POST
    @Path("/register")
    @Transactional
    public ApiResponse<UserInfo> register(RegisterRequest request) {
        LOG.infof("Registration attempt for username: %s, email: %s", request.username, request.email);
        
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

        if (userRepository.existsByUsername(request.username)) {
            LOG.warnf("Registration failed: Username '%s' already exists", request.username);
            return ApiResponse.error("Username already exists");
        }

        if (userRepository.existsByEmail(request.email)) {
            LOG.warnf("Registration failed: Email '%s' already exists", request.email);
            return ApiResponse.error("Email already exists");
        }

        User user = new User();
        user.username = request.username;
        user.email = request.email;
        user.password = request.password; // TODO: Hash password with BCrypt
        user.name = request.name != null ? request.name : request.username;
        user.role = request.role != null ? request.role : "ANALYST";
        user.active = true;
        user.createdAt = Instant.now();

        userRepository.persist(user);
        
        LOG.infof("✅ User account created successfully - ID: %d, Username: %s, Email: %s, Role: %s",
                  user.id, user.username, user.email, user.role);

        UserInfo userInfo = new UserInfo();
        userInfo.id = user.id.toString();
        userInfo.username = user.username;
        userInfo.email = user.email;
        userInfo.role = user.role;
        userInfo.name = user.name;

        return ApiResponse.success(userInfo, "User registered successfully");
    }

    @GET
    @Path("/me")
    public ApiResponse<UserInfo> getCurrentUser() {
        // TODO: Extract user from JWT token in security context
        UserInfo userInfo = new UserInfo();
        userInfo.id = "1";
        userInfo.username = "admin";
        userInfo.email = "admin@complianceguard.com";
        userInfo.role = "ADMIN";
        userInfo.name = "System Administrator";

        return ApiResponse.success(userInfo);
    }

    private String generateToken(User user) {
        try {
            Set<String> roles = new HashSet<>();
            roles.add(user.role);

            return Jwt.issuer("https://complianceguard.com")
                    .upn(user.username)
                    .groups(roles)
                    .claim("userId", user.id)
                    .claim("email", user.email)
                    .claim("name", user.name)
                    .expiresIn(Duration.ofHours(24))
                    .sign();
        } catch (Exception e) {
            return "mock-jwt-token-" + user.username;
        }
    }

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
        public String name;
    }
}

// Made with Bob
