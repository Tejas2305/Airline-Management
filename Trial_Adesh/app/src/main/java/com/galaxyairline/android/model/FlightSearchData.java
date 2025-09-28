package com.galaxyairline.android.model;

public class FlightSearchData {
    private String from;
    private String to;
    private String departDate;
    private String returnDate;
    private String tripType; // "one-way" or "round-trip"
    private Passengers passengers;
    private String classType; // "economy", "business", "first"

    // Constructors
    public FlightSearchData() {
        this.passengers = new Passengers();
        this.tripType = "one-way";
        this.classType = "economy";
    }

    // Getters and setters
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

    public String getDepartDate() {
        return departDate;
    }

    public void setDepartDate(String departDate) {
        this.departDate = departDate;
    }

    public String getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(String returnDate) {
        this.returnDate = returnDate;
    }

    public String getTripType() {
        return tripType;
    }

    public void setTripType(String tripType) {
        this.tripType = tripType;
    }

    public Passengers getPassengers() {
        return passengers;
    }

    public void setPassengers(Passengers passengers) {
        this.passengers = passengers;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    // Nested class for passenger information
    public static class Passengers {
        private int adults;
        private int children;

        public Passengers() {
            this.adults = 1;
            this.children = 0;
        }

        public Passengers(int adults, int children) {
            this.adults = adults;
            this.children = children;
        }

        public int getAdults() {
            return adults;
        }

        public void setAdults(int adults) {
            this.adults = adults;
        }

        public int getChildren() {
            return children;
        }

        public void setChildren(int children) {
            this.children = children;
        }

        public int getTotal() {
            return adults + children;
        }
    }
}