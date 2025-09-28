package com.galaxyairline.android.model;

import java.util.List;

public class Analytics {
    private double totalRevenue;
    private int totalBookings;
    private ClassRevenue classRevenue;
    private List<FlightStats> flightStats;
    private String averageBookingValue;

    // Constructors
    public Analytics() {}

    // Getters and setters
    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public int getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(int totalBookings) {
        this.totalBookings = totalBookings;
    }

    public ClassRevenue getClassRevenue() {
        return classRevenue;
    }

    public void setClassRevenue(ClassRevenue classRevenue) {
        this.classRevenue = classRevenue;
    }

    public List<FlightStats> getFlightStats() {
        return flightStats;
    }

    public void setFlightStats(List<FlightStats> flightStats) {
        this.flightStats = flightStats;
    }

    public String getAverageBookingValue() {
        return averageBookingValue;
    }

    public void setAverageBookingValue(String averageBookingValue) {
        this.averageBookingValue = averageBookingValue;
    }

    // Nested classes
    public static class ClassRevenue {
        private double economy;
        private double business;
        private double first;

        public ClassRevenue() {}

        public double getEconomy() {
            return economy;
        }

        public void setEconomy(double economy) {
            this.economy = economy;
        }

        public double getBusiness() {
            return business;
        }

        public void setBusiness(double business) {
            this.business = business;
        }

        public double getFirst() {
            return first;
        }

        public void setFirst(double first) {
            this.first = first;
        }
    }

    public static class FlightStats {
        private String flightNumber;
        private String occupancyRate;
        private double revenue;

        public FlightStats() {}

        public String getFlightNumber() {
            return flightNumber;
        }

        public void setFlightNumber(String flightNumber) {
            this.flightNumber = flightNumber;
        }

        public String getOccupancyRate() {
            return occupancyRate;
        }

        public void setOccupancyRate(String occupancyRate) {
            this.occupancyRate = occupancyRate;
        }

        public double getRevenue() {
            return revenue;
        }

        public void setRevenue(double revenue) {
            this.revenue = revenue;
        }
    }
}