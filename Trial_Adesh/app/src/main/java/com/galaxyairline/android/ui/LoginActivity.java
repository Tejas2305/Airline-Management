package com.galaxyairline.android.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.galaxyairline.android.api.ApiClient;
import com.galaxyairline.android.api.GalaxyAirlineAPI;
import com.galaxyairline.android.databinding.ActivityLoginBinding;
import com.galaxyairline.android.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    
    private ActivityLoginBinding binding;
    private SessionManager sessionManager;
    private GalaxyAirlineAPI apiService;
    private boolean isLoading = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        sessionManager = new SessionManager(this);
        apiService = ApiClient.getApiService();
        
        setupUI();
    }
    
    private void setupUI() {
        // Back button
        binding.btnBack.setOnClickListener(v -> finish());
        
        // Tab switching
        binding.tabLayout.addOnTabSelectedListener(new com.google.android.material.tabs.TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(com.google.android.material.tabs.TabLayout.Tab tab) {
                if (tab.getPosition() == 0) {
                    // Login tab
                    binding.loginForm.setVisibility(android.view.View.VISIBLE);
                    binding.signupForm.setVisibility(android.view.View.GONE);
                } else {
                    // Signup tab
                    binding.loginForm.setVisibility(android.view.View.GONE);
                    binding.signupForm.setVisibility(android.view.View.VISIBLE);
                }
            }
            
            @Override
            public void onTabUnselected(com.google.android.material.tabs.TabLayout.Tab tab) {}
            
            @Override
            public void onTabReselected(com.google.android.material.tabs.TabLayout.Tab tab) {}
        });
        
        // Login form submission
        binding.btnLogin.setOnClickListener(v -> handleLogin());
        
        // Signup form submission
        binding.btnSignup.setOnClickListener(v -> handleSignup());
        
        // Admin demo button
        binding.btnAdminDemo.setOnClickListener(v -> handleAdminDemo());
        
        // Quick login credentials
        binding.btnQuickLogin.setOnClickListener(v -> {
            binding.editTextLoginEmail.setText("user@example.com");
            binding.editTextLoginPassword.setText("password");
        });
    }
    
    private void handleLogin() {
        if (isLoading) return;
        
        String email = binding.editTextLoginEmail.getText().toString().trim();
        String password = binding.editTextLoginPassword.getText().toString().trim();
        
        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }
        
        setLoading(true);
        binding.textLoginError.setText("");
        
        GalaxyAirlineAPI.LoginRequest request = new GalaxyAirlineAPI.LoginRequest(email, password);
        Call<GalaxyAirlineAPI.AuthResponse> call = apiService.login(request);
        
        call.enqueue(new Callback<GalaxyAirlineAPI.AuthResponse>() {
            @Override
            public void onResponse(Call<GalaxyAirlineAPI.AuthResponse> call, Response<GalaxyAirlineAPI.AuthResponse> response) {
                setLoading(false);
                
                if (response.isSuccessful() && response.body() != null) {
                    GalaxyAirlineAPI.AuthResponse authResponse = response.body();
                    if (authResponse.isSuccess() && authResponse.getUser() != null) {
                        sessionManager.createLoginSession(authResponse.getUser(), authResponse.getAccessToken());
                        navigateToDashboard(authResponse.getUser().isAdmin());
                    } else {
                        binding.textLoginError.setText(authResponse.getMessage() != null ? authResponse.getMessage() : "Login failed");
                    }
                } else {
                    binding.textLoginError.setText("Login failed - please try again");
                }
            }
            
            @Override
            public void onFailure(Call<GalaxyAirlineAPI.AuthResponse> call, Throwable t) {
                setLoading(false);
                binding.textLoginError.setText("Network error - please check your connection");
            }
        });
    }
    
    private void handleSignup() {
        if (isLoading) return;
        
        String name = binding.editTextSignupName.getText().toString().trim();
        String email = binding.editTextSignupEmail.getText().toString().trim();
        String password = binding.editTextSignupPassword.getText().toString().trim();
        
        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }
        
        setLoading(true);
        binding.textSignupError.setText("");
        
        GalaxyAirlineAPI.SignupRequest request = new GalaxyAirlineAPI.SignupRequest(email, password, name);
        Call<GalaxyAirlineAPI.AuthResponse> call = apiService.signup(request);
        
        call.enqueue(new Callback<GalaxyAirlineAPI.AuthResponse>() {
            @Override
            public void onResponse(Call<GalaxyAirlineAPI.AuthResponse> call, Response<GalaxyAirlineAPI.AuthResponse> response) {
                setLoading(false);
                
                if (response.isSuccessful() && response.body() != null) {
                    GalaxyAirlineAPI.AuthResponse authResponse = response.body();
                    if (authResponse.isSuccess() && authResponse.getUser() != null) {
                        sessionManager.createLoginSession(authResponse.getUser(), authResponse.getAccessToken());
                        Toast.makeText(LoginActivity.this, "Account created successfully!", Toast.LENGTH_SHORT).show();
                        navigateToDashboard(authResponse.getUser().isAdmin());
                    } else {
                        binding.textSignupError.setText(authResponse.getMessage() != null ? authResponse.getMessage() : "Signup failed");
                    }
                } else {
                    binding.textSignupError.setText("Signup failed - please try again");
                }
            }
            
            @Override
            public void onFailure(Call<GalaxyAirlineAPI.AuthResponse> call, Throwable t) {
                setLoading(false);
                binding.textSignupError.setText("Network error - please check your connection");
            }
        });
    }
    
    private void handleAdminDemo() {
        if (isLoading) return;
        
        setLoading(true);
        
        // Try admin login first
        GalaxyAirlineAPI.LoginRequest request = new GalaxyAirlineAPI.LoginRequest("admin@galaxy.com", "admin123");
        Call<GalaxyAirlineAPI.AuthResponse> call = apiService.login(request);
        
        call.enqueue(new Callback<GalaxyAirlineAPI.AuthResponse>() {
            @Override
            public void onResponse(Call<GalaxyAirlineAPI.AuthResponse> call, Response<GalaxyAirlineAPI.AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    // Admin login successful
                    GalaxyAirlineAPI.AuthResponse authResponse = response.body();
                    sessionManager.createLoginSession(authResponse.getUser(), authResponse.getAccessToken());
                    navigateToDashboard(true);
                } else {
                    // Try creating admin account
                    createAdminDemo();
                }
                setLoading(false);
            }
            
            @Override
            public void onFailure(Call<GalaxyAirlineAPI.AuthResponse> call, Throwable t) {
                // Try creating admin account on network failure
                createAdminDemo();
            }
        });
    }
    
    private void createAdminDemo() {
        GalaxyAirlineAPI.SignupRequest signupRequest = new GalaxyAirlineAPI.SignupRequest("admin@galaxy.com", "admin123", "Galaxy Admin");
        Call<GalaxyAirlineAPI.AuthResponse> signupCall = apiService.signup(signupRequest);
        
        signupCall.enqueue(new Callback<GalaxyAirlineAPI.AuthResponse>() {
            @Override
            public void onResponse(Call<GalaxyAirlineAPI.AuthResponse> call, Response<GalaxyAirlineAPI.AuthResponse> response) {
                setLoading(false);
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    Toast.makeText(LoginActivity.this, "Admin demo account created - please sign in again", Toast.LENGTH_LONG).show();
                } else {
                    // Fallback to local demo session
                    Toast.makeText(LoginActivity.this, "Using local admin demo session", Toast.LENGTH_SHORT).show();
                    createLocalAdminSession();
                }
            }
            
            @Override
            public void onFailure(Call<GalaxyAirlineAPI.AuthResponse> call, Throwable t) {
                setLoading(false);
                // Fallback to local demo session
                Toast.makeText(LoginActivity.this, "Using local admin demo session", Toast.LENGTH_SHORT).show();
                createLocalAdminSession();
            }
        });
    }
    
    private void createLocalAdminSession() {
        // Create a local admin user for demo purposes
        com.galaxyairline.android.model.User adminUser = new com.galaxyairline.android.model.User(
            "admin-id", "admin@galaxy.com", "Galaxy Admin", "admin"
        );
        sessionManager.createLoginSession(adminUser, "demo-token");
        navigateToDashboard(true);
    }
    
    private void setLoading(boolean loading) {
        isLoading = loading;
        binding.progressLogin.setVisibility(loading ? android.view.View.VISIBLE : android.view.View.GONE);
        binding.progressSignup.setVisibility(loading ? android.view.View.VISIBLE : android.view.View.GONE);
        binding.btnLogin.setEnabled(!loading);
        binding.btnSignup.setEnabled(!loading);
        binding.btnAdminDemo.setEnabled(!loading);
    }
    
    private void navigateToDashboard(boolean isAdmin) {
        Intent intent;
        if (isAdmin) {
            intent = new Intent(this, AdminDashboardActivity.class);
        } else {
            intent = new Intent(this, UserDashboardActivity.class);
        }
        startActivity(intent);
        finish();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}