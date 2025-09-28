package com.galaxyairline.android.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.galaxyairline.android.databinding.ActivityLandingBinding;
import com.galaxyairline.android.utils.SessionManager;

public class LandingActivity extends AppCompatActivity {
    
    private ActivityLandingBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLandingBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        sessionManager = new SessionManager(this);
        
        // Check if user is already logged in
        if (sessionManager.isLoggedIn()) {
            navigateToDashboard();
            return;
        }
        
        setupUI();
    }
    
    private void setupUI() {
        // Set up button click listeners
        binding.btnGetStarted.setOnClickListener(v -> {
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
        });
        
        binding.btnLearnMore.setOnClickListener(v -> {
            // Scroll to features section or show more info
            binding.scrollView.smoothScrollTo(0, binding.featuresSection.getTop());
        });
        
        binding.btnBookNow.setOnClickListener(v -> {
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
        });
    }
    
    private void navigateToDashboard() {
        Intent intent;
        if (sessionManager.getCurrentUser().isAdmin()) {
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