import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { 
  ArrowLeft, 
  Plane, 
  Clock, 
  Filter, 
  ArrowUpDown,
  MapPin,
  Star,
  Wifi,
  Utensils,
  Monitor
} from 'lucide-react';
import { supabase, supabaseUrl } from '../utils/supabaseClient';

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

interface FlightResultsProps {
  searchData: FlightSearchData;
  selectedFlights: {outbound: Flight | null, return: Flight | null};
  onFlightSelect: (flight: Flight, type: 'outbound' | 'return') => void;
  onBack: () => void;
}

export function FlightResults({ searchData, selectedFlights, onFlightSelect, onBack }: FlightResultsProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'non-stop' | '1-stop'>('all');
  const [currentStep, setCurrentStep] = useState<'outbound' | 'return'>('outbound');

  useEffect(() => {
    searchFlights();
  }, [searchData]);

  const searchFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/search-flights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: searchData.from,
          to: searchData.to,
          departDate: searchData.departDate,
          returnDate: searchData.returnDate,
          passengers: searchData.passengers,
          classType: searchData.classType
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setFlights(data.flights || []);
        
        // For round trip, also search return flights
        if (searchData.tripType === 'round-trip' && searchData.returnDate) {
          const returnResponse = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/search-flights`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: searchData.to,
              to: searchData.from,
              departDate: searchData.returnDate,
              passengers: searchData.passengers,
              classType: searchData.classType
            }),
          });
          
          const returnData = await returnResponse.json();
          setReturnFlights(returnData.flights || []);
        }
      } else {
        console.error('Search failed:', data.error);
        setFlights([]);
        setReturnFlights([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setFlights([]);
      setReturnFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const sortFlights = (flightsList: Flight[]) => {
    return [...flightsList].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a[searchData.classType].price - b[searchData.classType].price;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'departure':
          return a.departure.localeCompare(b.departure);
        default:
          return 0;
      }
    });
  };

  const filterFlights = (flightsList: Flight[]) => {
    if (filterBy === 'all') return flightsList;
    return flightsList.filter(flight => flight.stops === filterBy);
  };

  const processedFlights = sortFlights(filterFlights(flights));
  const processedReturnFlights = sortFlights(filterFlights(returnFlights));

  const currentFlights = currentStep === 'outbound' ? processedFlights : processedReturnFlights;
  const isSelectingReturn = searchData.tripType === 'round-trip' && selectedFlights.outbound && !selectedFlights.return;

  useEffect(() => {
    if (selectedFlights.outbound && searchData.tripType === 'round-trip' && !selectedFlights.return) {
      setCurrentStep('return');
    }
  }, [selectedFlights.outbound, searchData.tripType, selectedFlights.return]);

  const handleFlightSelect = (flight: Flight) => {
    if (currentStep === 'outbound') {
      onFlightSelect(flight, 'outbound');
    } else {
      onFlightSelect(flight, 'return');
    }
  };

  const getClassPrice = (flight: Flight) => {
    return flight[searchData.classType].price;
  };

  const getClassAvailable = (flight: Flight) => {
    return flight[searchData.classType].available;
  };

  const getTotalPassengers = () => {
    return searchData.passengers.adults + searchData.passengers.children;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                {currentStep === 'outbound' ? 'Select Outbound Flight' : 'Select Return Flight'}
              </h1>
              <p className="text-sm text-gray-600">
                {searchData.from} → {searchData.to} • {searchData.departDate}
              </p>
            </div>

            <div className="w-10"></div>
          </div>

          {/* Trip Progress for Round Trip */}
          {searchData.tripType === 'round-trip' && (
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  selectedFlights.outbound ? 'bg-green-500 text-white' : currentStep === 'outbound' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  selectedFlights.return ? 'bg-green-500 text-white' : currentStep === 'return' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>
          )}

          {/* Search Summary */}
          <div className="bg-red-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Route</p>
                <p className="font-medium">{searchData.from} → {searchData.to}</p>
              </div>
              <div>
                <p className="text-gray-600">Passengers</p>
                <p className="font-medium">{getTotalPassengers()} passenger{getTotalPassengers() > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-gray-600">Class</p>
                <p className="font-medium capitalize">{searchData.classType}</p>
              </div>
              <div>
                <p className="text-gray-600">Trip Type</p>
                <p className="font-medium capitalize">{searchData.tripType.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Mobile Filter Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filter & Sort</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Sort by</label>
                      <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as 'price' | 'duration' | 'departure')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Price (Low to High)</SelectItem>
                          <SelectItem value="duration">Duration</SelectItem>
                          <SelectItem value="departure">Departure Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Filter by</label>
                      <Select value={filterBy} onValueChange={(value: string) => setFilterBy(value as 'non-stop' | '1-stop' | 'all')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Flights</SelectItem>
                          <SelectItem value="non-stop">Non-stop only</SelectItem>
                          <SelectItem value="1-stop">1 Stop maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filters */}
              <div className="hidden sm:flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-44">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="departure">Departure Time</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Flights</SelectItem>
                    <SelectItem value="non-stop">Non-stop only</SelectItem>
                    <SelectItem value="1-stop">1 Stop max</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Badge variant="secondary">
              {currentFlights.length} flight{currentFlights.length !== 1 ? 's' : ''} found
            </Badge>
          </div>
        </div>
      </div>

      {/* Flight List */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {currentFlights.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                <Button onClick={onBack} variant="outline">
                  Modify Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            currentFlights.map((flight) => (
              <Card key={flight.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Flight Header - Mobile */}
                    <div className="flex items-center justify-between sm:hidden">
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

                    {/* Flight Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Desktop Flight Info */}
                      <div className="hidden sm:block sm:col-span-2">
                        <h3 className="font-semibold text-gray-900">{flight.flightNumber}</h3>
                        <p className="text-sm text-gray-600">{flight.aircraft}</p>
                      </div>

                      {/* Route & Time */}
                      <div className="sm:col-span-6">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{flight.departure}</p>
                            <p className="text-sm text-gray-600">{flight.fromCode}</p>
                            <p className="text-xs text-gray-500">{flight.from}</p>
                          </div>

                          <div className="flex-1 mx-4">
                            <div className="relative">
                              <div className="border-t-2 border-gray-300"></div>
                              <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-red-600 bg-white" />
                            </div>
                            <div className="text-center mt-1">
                              <p className="text-sm text-gray-600">{flight.duration}</p>
                              <Badge size="sm" className={`mt-1 ${
                                flight.stops === 'non-stop' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              } hidden sm:inline-flex`}>
                                {flight.stops}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{flight.arrival}</p>
                            <p className="text-sm text-gray-600">{flight.toCode}</p>
                            <p className="text-xs text-gray-500">{flight.to}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price & Select */}
                      <div className="sm:col-span-4">
                        <div className="text-center sm:text-right">
                          <div className="mb-2">
                            <p className="text-2xl font-bold text-red-600">
                              ${getClassPrice(flight)}
                            </p>
                            <p className="text-sm text-gray-600">per person</p>
                            <p className="text-xs text-gray-500">
                              {getClassAvailable(flight)} seats left
                            </p>
                          </div>
                          
                          <Button 
                            onClick={() => handleFlightSelect(flight)}
                            disabled={getClassAvailable(flight) < getTotalPassengers()}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                          >
                            Select Flight
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Amenities - Mobile */}
                    <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-100 sm:hidden">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Wifi className="h-3 w-3" />
                        <span>WiFi</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Utensils className="h-3 w-3" />
                        <span>Meal</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Monitor className="h-3 w-3" />
                        <span>Entertainment</span>
                      </div>
                    </div>

                    {/* Amenities - Desktop */}
                    <div className="hidden sm:flex items-center justify-center gap-6 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Wifi className="h-4 w-4" />
                        <span>Free WiFi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Utensils className="h-4 w-4" />
                        <span>Complimentary Meal</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Monitor className="h-4 w-4" />
                        <span>In-flight Entertainment</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}