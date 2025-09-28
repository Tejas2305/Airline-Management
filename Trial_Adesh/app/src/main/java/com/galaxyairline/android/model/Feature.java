package com.galaxyairline.android.model;

public class Feature {
    private String icon;
    private String title;
    private String description;
    private String action;

    public Feature(String icon, String title, String description, String action) {
        this.icon = icon;
        this.title = title;
        this.description = description;
        this.action = action;
    }

    // Getters and setters
    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}