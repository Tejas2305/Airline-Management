import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FlightSearchData {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  passengers: {
    adults: number;
    children: number;
  };
  classType: 'economy' | 'business' | 'first';
}

interface PassengerData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface PassengerDetailsProps {
  searchData: FlightSearchData;
  onContinue: (passengers: PassengerData[]) => void;
  onBack: () => void;
}

export function PassengerDetails({ searchData, onContinue, onBack }: PassengerDetailsProps) {
  const getTotalPassengers = () => {
    return searchData.passengers.adults + searchData.passengers.children;
  };

  const initializePassengers = (): PassengerData[] => {
    const total = getTotalPassengers();
    return Array.from({ length: total }, () => ({
      name: '',
      phone: '',
      email: '',
      address: ''
    }));
  };

  const [passengers, setPassengers] = useState<PassengerData[]>(initializePassengers());
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    
    // Clear error when user starts typing
    const errorKey = `${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[errorKey];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    passengers.forEach((passenger, index) => {
      // Name validation
      if (!passenger.name.trim()) {
        newErrors[`${index}-name`] = 'Name is required';
      } else if (passenger.name.trim().length < 2) {
        newErrors[`${index}-name`] = 'Name must be at least 2 characters';
      }
      
      // Phone validation
      if (!passenger.phone.trim()) {
        newErrors[`${index}-phone`] = 'Phone number is required';
      } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(passenger.phone.trim())) {
        newErrors[`${index}-phone`] = 'Please enter a valid phone number';
      }
      
      // Email validation
      if (!passenger.email.trim()) {
        newErrors[`${index}-email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email.trim())) {
        newErrors[`${index}-email`] = 'Please enter a valid email address';
      }
      
      // Address validation
      if (!passenger.address.trim()) {
        newErrors[`${index}-address`] = 'Address is required';
      } else if (passenger.address.trim().length < 10) {
        newErrors[`${index}-address`] = 'Please provide a complete address';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onContinue(passengers);
  };

  const copyToAll = (sourceIndex: number) => {
    const sourcePassenger = passengers[sourceIndex];
    setPassengers(prev => 
      prev.map((passenger, index) => 
        index === 0 ? passenger : { ...sourcePassenger }
      )
    );
  };

  const getPassengerType = (index: number): string => {
    if (index < searchData.passengers.adults) {
      return 'Adult';
    } else {
      return 'Child';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Passenger Details</h1>
              <p className="text-sm text-gray-600">Enter information for all passengers</p>
            </div>

            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Summary */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Trip Summary</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-semibold">{searchData.from} → {searchData.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passengers</p>
                    <p className="font-semibold">{getTotalPassengers()} passenger{getTotalPassengers() > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-semibold capitalize">{searchData.classType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trip Type</p>
                    <p className="font-semibold capitalize">{searchData.tripType.replace('-', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Information</p>
                    <p>Please ensure all passenger details match exactly with the ID documents that will be presented at the airport. Names cannot be changed after booking.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Forms */}
            {passengers.map((passenger, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Passenger {index + 1}
                        </h3>
                        <Badge variant="secondary">
                          {getPassengerType(index)}
                        </Badge>
                      </div>
                    </div>
                    
                    {index === 0 && passengers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAll(0)}
                        className="hidden sm:flex border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Copy to All
                      </Button>
                    )}
                  </div>
                  
                  {/* Mobile Copy Button */}
                  {index === 0 && passengers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToAll(0)}
                      className="sm:hidden w-full mt-3 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Copy to All Other Passengers
                    </Button>
                  )}
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter full name as per ID"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                          className={`pl-10 h-12 ${
                            errors[`${index}-name`] 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                          }`}
                          required
                        />
                      </div>
                      {errors[`${index}-name`] && (
                        <p className="text-sm text-red-600">{errors[`${index}-name`]}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={passenger.phone}
                          onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                          className={`pl-10 h-12 ${
                            errors[`${index}-phone`] 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                          }`}
                          required
                        />
                      </div>
                      {errors[`${index}-phone`] && (
                        <p className="text-sm text-red-600">{errors[`${index}-phone`]}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="passenger@example.com"
                          value={passenger.email}
                          onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                          className={`pl-10 h-12 ${
                            errors[`${index}-email`] 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                          }`}
                          required
                        />
                      </div>
                      {errors[`${index}-email`] && (
                        <p className="text-sm text-red-600">{errors[`${index}-email`]}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Textarea
                          placeholder="Enter complete address including city, state, and postal code"
                          value={passenger.address}
                          onChange={(e) => updatePassenger(index, 'address', e.target.value)}
                          rows={3}
                          className={`pl-10 resize-none ${
                            errors[`${index}-address`] 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                          }`}
                          required
                        />
                      </div>
                      {errors[`${index}-address`] && (
                        <p className="text-sm text-red-600">{errors[`${index}-address`]}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Form Validation Summary */}
            {Object.keys(errors).length > 0 && (
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium mb-1">Please fix the following errors:</p>
                      <p>Complete all required fields with valid information before proceeding.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Terms and Conditions */}
            <Card className="border-0 shadow-md bg-gray-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-2">Terms & Conditions</p>
                    <p className="mb-2">
                      By proceeding, you agree to Galaxy Airlines' terms of service and privacy policy. 
                      You confirm that all passenger information is accurate and matches official identification documents.
                    </p>
                    <p className="text-xs text-gray-600">
                      Changes to passenger names may incur additional fees or may not be permitted after booking completion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={onBack}
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Review
              </Button>
              <Button 
                type="submit"
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Continue to Payment
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}