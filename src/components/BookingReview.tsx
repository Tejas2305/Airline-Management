import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Plane, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  Calendar,
  Edit,
  CheckCircle
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

interface Flight {
  id: string;
  flightNumber: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  aircraft: string;
  date: string;
  economy: { price: number; available: number };
  business: { price: number; available: number };
  first: { price: number; available: number };
  stops: 'non-stop' | '1-stop' | '2-stops';
}

interface BookingReviewProps {
  searchData: FlightSearchData;
  selectedFlights: {outbound: Flight | null, return: Flight | null};
  totalPrice: number;
  onContinue: () => void;
  onBack: () => void;
}

export function BookingReview({ searchData, selectedFlights, totalPrice, onContinue, onBack }: BookingReviewProps) {
  const getTotalPassengers = () => {
    return searchData.passengers.adults + searchData.passengers.children;
  };

  const getClassIcon = (classType: string) => {
    switch (classType) {
      case 'economy': return '💺';
      case 'business': return '🥂';
      case 'first': return '👑';
      default: return '💺';
    }
  };

  const getClassPrice = (flight: Flight) => {
    return flight[searchData.classType].price;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const FlightCard = ({ flight, type }: { flight: Flight, type: 'outbound' | 'return' }) => (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Flight Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{flight.flightNumber}</h3>
              <p className="text-sm text-gray-600">{flight.aircraft}</p>
            </div>
            <Badge className={`${
              flight.stops === 'non-stop' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {flight.stops}
            </Badge>
          </div>

          {/* Route Info */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{flight.departure}</p>
              <p className="text-sm text-gray-600">{flight.fromCode}</p>
              <p className="text-xs text-gray-500">{flight.from}</p>
            </div>

            <div className="flex-1 mx-4">
              <div className="relative">
                <div className="border-t-2 border-gray-300"></div>
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-red-600 bg-white" />
              </div>
              <div className="text-center mt-1">
                <p className="text-sm text-gray-600">{flight.duration}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{flight.arrival}</p>
              <p className="text-sm text-gray-600">{flight.toCode}</p>
              <p className="text-xs text-gray-500">{flight.to}</p>
            </div>
          </div>

          {/* Date and Class */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(type === 'outbound' ? searchData.departDate : searchData.returnDate || '')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{getClassIcon(searchData.classType)}</span>
              <span className="capitalize">{searchData.classType} Class</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Review Your Booking</h1>
              <p className="text-sm text-gray-600">Please review your flight details</p>
            </div>

            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
            >
              <Edit className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Trip Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Flight Selection Complete</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Trip Type</p>
                  <p className="font-semibold capitalize">{searchData.tripType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="font-semibold">{getTotalPassengers()} passenger{getTotalPassengers() > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-semibold flex items-center justify-center gap-1">
                    <span>{getClassIcon(searchData.classType)}</span>
                    <span className="capitalize">{searchData.classType}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="font-semibold text-red-600 text-lg">${totalPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Breakdown */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Passenger Details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchData.passengers.adults > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Adults (12+ years)</h4>
                    <p className="text-2xl font-bold text-red-600">{searchData.passengers.adults}</p>
                    <p className="text-sm text-gray-600">passenger{searchData.passengers.adults > 1 ? 's' : ''}</p>
                  </div>
                )}
                
                {searchData.passengers.children > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Children (2-11 years)</h4>
                    <p className="text-2xl font-bold text-red-600">{searchData.passengers.children}</p>
                    <p className="text-sm text-gray-600">passenger{searchData.passengers.children > 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Outbound Flight */}
          {selectedFlights.outbound && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Outbound Flight</h3>
              </div>
              <FlightCard flight={selectedFlights.outbound} type="outbound" />
            </div>
          )}

          {/* Return Flight */}
          {selectedFlights.return && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-red-600 transform rotate-180" />
                <h3 className="text-lg font-semibold text-gray-900">Return Flight</h3>
              </div>
              <FlightCard flight={selectedFlights.return} type="return" />
            </div>
          )}

          {/* Price Breakdown */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
              
              <div className="space-y-3">
                {selectedFlights.outbound && (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-900">Outbound Flight ({selectedFlights.outbound.flightNumber})</p>
                      <p className="text-sm text-gray-600">{getTotalPassengers()} × ${getClassPrice(selectedFlights.outbound)} ({searchData.classType})</p>
                    </div>
                    <p className="font-semibold">${getClassPrice(selectedFlights.outbound) * getTotalPassengers()}</p>
                  </div>
                )}

                {selectedFlights.return && (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-900">Return Flight ({selectedFlights.return.flightNumber})</p>
                      <p className="text-sm text-gray-600">{getTotalPassengers()} × ${getClassPrice(selectedFlights.return)} ({searchData.classType})</p>
                    </div>
                    <p className="font-semibold">${getClassPrice(selectedFlights.return) * getTotalPassengers()}</p>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                  <p className="text-2xl font-bold text-red-600">${totalPrice}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-3 mt-4">
                  <p className="text-sm text-green-700 text-center">
                    ✅ All taxes and fees included • No hidden charges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-0 shadow-md bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Check-in opens 24 hours before departure</p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Arrive at airport at least 2 hours before domestic flights</p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Valid ID required for all passengers</p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Free cancellation within 24 hours of booking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="mr-2 h-4 w-4" />
              Modify Selection
            </Button>
            <Button 
              onClick={onContinue}
              className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Continue to Passenger Details
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}