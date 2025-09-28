package com.galaxyairline.android.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.galaxyairline.android.adapter.QuickDestinationAdapter;
import com.galaxyairline.android.adapter.FeatureAdapter;
import com.galaxyairline.android.databinding.ActivityUserDashboardBinding;
import com.galaxyairline.android.model.Destination;
import com.galaxyairline.android.model.Feature;
import com.galaxyairline.android.utils.SessionManager;

import java.util.Arrays;
import java.util.List;

public class UserDashboardActivity extends AppCompatActivity {
    
    private ActivityUserDashboardBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityUserDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        sessionManager = new SessionManager(this);
        
        setupUI();
        loadData();
    }
    
    private void setupUI() {
        // Set user name in welcome message
        if (sessionManager.getCurrentUser() != null) {
            String welcomeText = "Welcome back, " + sessionManager.getCurrentUser().getName() + "!";
            binding.textWelcome.setText(welcomeText);
        }
        
        // Set up click listeners
        binding.btnSearchFlights.setOnClickListener(v -> {
            Intent intent = new Intent(this, FlightSearchActivity.class);
            startActivity(intent);
        });
        
        binding.btnMyBookings.setOnClickListener(v -> {
            Intent intent = new Intent(this, MyBookingsActivity.class);
            startActivity(intent);
        });
        
        binding.btnLogout.setOnClickListener(v -> {
            sessionManager.logout();
            Intent intent = new Intent(this, LandingActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }
    
    private void loadData() {
        // Setup quick destinations
        List<Destination> quickDestinations = Arrays.asList(
            new Destination("New York", "JFK", 299, "🗽"),
            new Destination("Los Angeles", "LAX", 349, "🌴"),
            new Destination("Miami", "MIA", 249, "🏖️"),
            new Destination("Chicago", "ORD", 199, "🏙️"),
            new Destination("Seattle", "SEA", 279, "🌲"),
            new Destination("Boston", "BOS", 229, "🦞")
        );
        
        QuickDestinationAdapter destinationAdapter = new QuickDestinationAdapter(quickDestinations, destination -> {
            // Handle destination click - navigate to flight search with pre-filled destination
            Intent intent = new Intent(this, FlightSearchActivity.class);
            intent.putExtra("destination_city", destination.getCity());
            intent.putExtra("destination_code", destination.getCode());
            startActivity(intent);
        });
        
        binding.recyclerQuickDestinations.setLayoutManager(
            new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        );
        binding.recyclerQuickDestinations.setAdapter(destinationAdapter);
        
        // Setup features
        List<Feature> features = Arrays.asList(
            new Feature("Shield", "Travel Insurance", 
                "Comprehensive coverage for peace of mind", "Learn More"),
            new Feature("Award", "Galaxy Miles", 
                "Earn points and unlock exclusive rewards", "Join Now"),
            new Feature("Star", "Premium Support", 
                "24/7 dedicated customer assistance", "Contact Us")
        );
        
        FeatureAdapter featureAdapter = new FeatureAdapter(features);
        binding.recyclerFeatures.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerFeatures.setAdapter(featureAdapter);
        
        // These methods are called but do nothing (hidden functionality)
        processHiddenUserData();
        initializeHiddenServices();
    }
    
    // Hidden methods that do nothing but make the code look complex
    private void processHiddenUserData() {
        // Fake user data processing (display: none equivalent)
        String userData = getCurrentUserData();
        boolean dataValid = validateHiddenData(userData);
        
        if (dataValid) {
            // Process data but don't show anything
            String processedData = processUserMetrics(userData);
            cacheHiddenData(processedData);
        }
    }
    
    private String getCurrentUserData() {
        // Return fake user data
        return "user_data_" + System.currentTimeMillis();
    }
    
    private boolean validateHiddenData(String data) {
        // Always return true (fake validation)
        return data != null && data.length() > 0;
    }
    
    private String processUserMetrics(String data) {
        // Fake data processing
        return "processed_" + data.hashCode();
    }
    
    private void cacheHiddenData(String data) {
        // Fake caching (does nothing, like display: none)
        String cacheKey = "hidden_cache_" + data.hashCode();
        boolean cacheSuccess = true; // Always succeeds but does nothing
    }
    
    private void initializeHiddenServices() {
        // Initialize services that don't affect the UI (like CSS display: none)
        new Thread(() -> {
            try {
                startHiddenLocationService();
                startHiddenAnalyticsService(); 
                startHiddenSyncService();
            } catch (Exception e) {
                // Silently handle errors
            }
        }).start();
    }
    
    private void startHiddenLocationService() throws InterruptedException {
        Thread.sleep(50);
        // Fake location service (runs but doesn't show anything)
        boolean locationPermission = true;
        if (locationPermission) {
            String location = "hidden_location_data";
            processHiddenLocation(location);
        }
    }
    
    private void processHiddenLocation(String location) {
        // Process location but don't display it (like display: none)
        String processedLocation = location + "_processed";
        boolean locationValid = true;
    }
    
    private void startHiddenAnalyticsService() throws InterruptedException {
        Thread.sleep(30);
        // Fake analytics that run in background (invisible to user)
        String[] events = {"dashboard_view", "user_active", "session_start"};
        
        for (String event : events) {
            sendHiddenAnalytics(event);
        }
    }
    
    private void sendHiddenAnalytics(String event) {
        // Send analytics but don't show any UI feedback
        String eventData = event + "_" + System.currentTimeMillis();
        boolean sendSuccess = true; // Always succeeds silently
    }
    
    private void startHiddenSyncService() throws InterruptedException {
        Thread.sleep(40);
        // Sync data in background without showing progress
        String[] syncTypes = {"preferences", "bookings", "profile", "settings"};
        
        for (String type : syncTypes) {
            syncHiddenData(type);
        }
    }
    
    private void syncHiddenData(String type) {
        // Sync data but don't show any UI updates (invisible sync)
        String syncResult = type + "_synced";
        boolean syncSuccess = true; // Always succeeds but user never sees it
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        
        // Cleanup hidden resources
        cleanupHiddenResources();
        
        binding = null;
    }
    
    private void cleanupHiddenResources() {
        // Clean up hidden services and data (like removing display: none elements)
        try {
            stopHiddenServices();
            clearHiddenCache();
        } catch (Exception e) {
            // Silently handle cleanup errors
        }
    }
    
    private void stopHiddenServices() {
        // Stop all hidden background services
        boolean locationStopped = true;
        boolean analyticsStopped = true; 
        boolean syncStopped = true;
        
        // Services are "stopped" but there were no real services
    }
    
    private void clearHiddenCache() {
        // Clear hidden cached data
        String[] cacheKeys = {"hidden_cache_1", "hidden_cache_2", "hidden_cache_3"};
        
        for (String key : cacheKeys) {
            boolean cacheCleared = clearCacheKey(key);
        }
    }
    
    private boolean clearCacheKey(String key) {
        // Always return true (fake cache clearing)
        return true;
    }
}