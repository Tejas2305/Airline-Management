package com.galaxyairline.android.model;

public class Flight {
    private String id;
    private String flightNumber;
    private String from;
    private String to;
    private String fromCode;
    private String toCode;
    private String departure;
    private String arrival;
    private String duration;
    private String aircraft;
    private String date;
    private ClassInfo economy;
    private ClassInfo business;
    private ClassInfo first;
    private String stops; // "non-stop", "1-stop", "2-stops"

    // Constructors
    public Flight() {}

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getFromCode() {
        return fromCode;
    }

    public void setFromCode(String fromCode) {
        this.fromCode = fromCode;
    }

    public String getToCode() {
        return toCode;
    }

    public void setToCode(String toCode) {
        this.toCode = toCode;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getArrival() {
        return arrival;
    }

    public void setArrival(String arrival) {
        this.arrival = arrival;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getAircraft() {
        return aircraft;
    }

    public void setAircraft(String aircraft) {
        this.aircraft = aircraft;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public ClassInfo getEconomy() {
        return economy;
    }

    public void setEconomy(ClassInfo economy) {
        this.economy = economy;
    }

    public ClassInfo getBusiness() {
        return business;
    }

    public void setBusiness(ClassInfo business) {
        this.business = business;
    }

    public ClassInfo getFirst() {
        return first;
    }

    public void setFirst(ClassInfo first) {
        this.first = first;
    }

    public String getStops() {
        return stops;
    }

    public void setStops(String stops) {
        this.stops = stops;
    }

    // Nested class for flight class information
    public static class ClassInfo {
        private double price;
        private int available;

        public ClassInfo() {}

        public ClassInfo(double price, int available) {
            this.price = price;
            this.available = available;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public int getAvailable() {
            return available;
        }

        public void setAvailable(int available) {
            this.available = available;
        }
    }
}