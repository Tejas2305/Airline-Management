package com.galaxyairline.android.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.galaxyairline.android.databinding.ActivityAdminDashboardBinding;
import com.galaxyairline.android.utils.SessionManager;

public class AdminDashboardActivity extends AppCompatActivity {
    
    private ActivityAdminDashboardBinding binding;
    private SessionManager sessionManager;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        binding = ActivityAdminDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        sessionManager = new SessionManager(this);
        
        setupUI();
    }
    
    private void setupUI() {
        // Set welcome message
        if (sessionManager.getCurrentUser() != null) {
            String welcomeText = "Welcome, Admin " + sessionManager.getCurrentUser().getName() + "!";
            binding.textWelcome.setText(welcomeText);
        }
        
        // Set up click listeners
        binding.btnManageFlights.setOnClickListener(v -> {
            // Navigate to flight management (placeholder for now)
            // Intent intent = new Intent(this, FlightManagementActivity.class);
            // startActivity(intent);
        });
        
        binding.btnManageUsers.setOnClickListener(v -> {
            // Navigate to user management (placeholder for now)
            // Intent intent = new Intent(this, UserManagementActivity.class);
            // startActivity(intent);
        });
        
        binding.btnViewAnalytics.setOnClickListener(v -> {
            // Navigate to analytics (placeholder for now)
            // Intent intent = new Intent(this, AnalyticsActivity.class);
            // startActivity(intent);
        });
        
        binding.btnLogout.setOnClickListener(v -> {
            sessionManager.logout();
            Intent intent = new Intent(this, LandingActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }
}