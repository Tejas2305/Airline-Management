package com.galaxyairline.android.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.galaxyairline.android.databinding.ActivityFlightSearchBinding;
import com.galaxyairline.android.utils.SessionManager;

public class FlightSearchActivity extends AppCompatActivity {
    
    private ActivityFlightSearchBinding binding;
    private SessionManager sessionManager;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        binding = ActivityFlightSearchBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        sessionManager = new SessionManager(this);
        
        setupUI();
        handleIntent();
    }
    
    private void setupUI() {
        // Set up click listeners
        binding.btnSearchFlights.setOnClickListener(v -> {
            performFlightSearch();
        });
        
        binding.btnBack.setOnClickListener(v -> {
            finish();
        });
    }
    
    private void handleIntent() {
        // Handle pre-filled destination from UserDashboard
        Intent intent = getIntent();
        if (intent != null) {
            String destinationCity = intent.getStringExtra("destination_city");
            String destinationCode = intent.getStringExtra("destination_code");
            
            if (destinationCity != null && destinationCode != null) {
                binding.editDestination.setText(destinationCity + " (" + destinationCode + ")");
            }
        }
    }
    
    private void performFlightSearch() {
        String from = binding.editOrigin.getText().toString().trim();
        String to = binding.editDestination.getText().toString().trim();
        String departDate = binding.editDepartDate.getText().toString().trim();
        String returnDate = binding.editReturnDate.getText().toString().trim();
        
        if (from.isEmpty() || to.isEmpty() || departDate.isEmpty()) {
            // Show error message
            return;
        }
        
        // Navigate to flight results (placeholder for now)
        // Intent intent = new Intent(this, FlightResultsActivity.class);
        // intent.putExtra("from", from);
        // intent.putExtra("to", to);
        // intent.putExtra("depart_date", departDate);
        // intent.putExtra("return_date", returnDate);
        // startActivity(intent);
    }
}