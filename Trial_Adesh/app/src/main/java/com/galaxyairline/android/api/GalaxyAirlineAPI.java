package com.galaxyairline.android.api;

import com.galaxyairline.android.model.Analytics;
import com.galaxyairline.android.model.Flight;
import com.galaxyairline.android.model.User;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface GalaxyAirlineAPI {
    
    // Authentication endpoints
    @POST("make-server-59e5bae9/signup")
    Call<AuthResponse> signup(@Body SignupRequest request);
    
    @POST("make-server-59e5bae9/login")
    Call<AuthResponse> login(@Body LoginRequest request);
    
    // Flight endpoints
    @GET("make-server-59e5bae9/flights")
    Call<FlightsResponse> getFlights();
    
    @GET("make-server-59e5bae9/flights")
    Call<FlightsResponse> getFlights(@Header("Authorization") String token);
    
    // Admin endpoints
    @GET("make-server-59e5bae9/admin/analytics")
    Call<Analytics> getAnalytics(@Header("Authorization") String token);
    
    // Request models
    class SignupRequest {
        private String email;
        private String password;
        private String name;
        
        public SignupRequest(String email, String password, String name) {
            this.email = email;
            this.password = password;
            this.name = name;
        }
    }
    
    class LoginRequest {
        private String email;
        private String password;
        
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }
    }
    
    // Response models
    class AuthResponse {
        private User user;
        private String accessToken;
        private boolean success;
        private String message;
        
        public User getUser() {
            return user;
        }
        
        public String getAccessToken() {
            return accessToken;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public String getMessage() {
            return message;
        }
    }
    
    class FlightsResponse {
        private List<Flight> flights;
        private boolean success;
        
        public List<Flight> getFlights() {
            return flights;
        }
        
        public boolean isSuccess() {
            return success;
        }
    }
}