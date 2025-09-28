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
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}