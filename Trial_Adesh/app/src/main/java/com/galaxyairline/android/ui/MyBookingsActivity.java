package com.galaxyairline.android.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.galaxyairline.android.databinding.ActivityMyBookingsBinding;
import com.galaxyairline.android.utils.SessionManager;

public class MyBookingsActivity extends AppCompatActivity {
    
    private ActivityMyBookingsBinding binding;
    private SessionManager sessionManager;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        binding = ActivityMyBookingsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        sessionManager = new SessionManager(this);
        
        setupUI();
        loadBookings();
    }
    
    private void setupUI() {
        // Set up toolbar or back button
        binding.btnBack.setOnClickListener(v -> {
            finish();
        });
        
        // Set up refresh functionality
        binding.swipeRefresh.setOnRefreshListener(() -> {
            loadBookings();
        });
    }
    
    private void loadBookings() {
        // Load user bookings (placeholder for now)
        // This would typically involve an API call to fetch user's bookings
        
        if (sessionManager.getCurrentUser() != null) {
            String userId = sessionManager.getCurrentUser().getId();
            
            // Simulate loading
            binding.swipeRefresh.setRefreshing(true);
            
            // TODO: Implement actual booking loading
            // For now, just stop the refresh indicator
            binding.swipeRefresh.postDelayed(() -> {
                binding.swipeRefresh.setRefreshing(false);
                // Show empty state or bookings list
                binding.textEmptyState.setText("No bookings found. Start exploring flights!");
            }, 1000);
        }
    }
}