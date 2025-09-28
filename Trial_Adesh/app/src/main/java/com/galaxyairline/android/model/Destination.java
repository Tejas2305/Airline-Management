package com.galaxyairline.android.model;

public class Destination {
    private String city;
    private String code;
    private int price;
    private String image;

    public Destination(String city, String code, int price, String image) {
        this.city = city;
        this.code = code;
        this.price = price;
        this.image = image;
    }

    // Getters and setters
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}