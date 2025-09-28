package com.galaxyairline.android.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.galaxyairline.android.model.User;
import com.google.gson.Gson;

public class SessionManager {
    private static final String PREF_NAME = "GalaxyAirlineSession";
    private static final String KEY_USER = "user";
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";
    
    private SharedPreferences preferences;
    private SharedPreferences.Editor editor;
    private Gson gson;
    
    public SessionManager(Context context) {
        preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = preferences.edit();
        gson = new Gson();
    }
    
    public void createLoginSession(User user, String accessToken) {
        editor.putString(KEY_USER, gson.toJson(user));
        editor.putString(KEY_ACCESS_TOKEN, accessToken);
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.commit();
    }
    
    public User getCurrentUser() {
        String userJson = preferences.getString(KEY_USER, null);
        if (userJson != null) {
            return gson.fromJson(userJson, User.class);
        }
        return null;
    }
    
    public String getAccessToken() {
        return preferences.getString(KEY_ACCESS_TOKEN, null);
    }
    
    public boolean isLoggedIn() {
        return preferences.getBoolean(KEY_IS_LOGGED_IN, false);
    }
    
    public void logout() {
        editor.clear();
        editor.commit();
    }
}