import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, Plane, MapPin, Calendar, Users, Star } from 'lucide-react';
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

interface FlightSearchProps {
  onSearch: (data: FlightSearchData) => void;
  onBack: () => void;
}

export function FlightSearch({ onSearch, onBack }: FlightSearchProps) {
  const [searchData, setSearchData] = useState<FlightSearchData>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    tripType: 'one-way',
    passengers: {
      adults: 1,
      children: 0
    },
    classType: 'economy'
  });

  const [availableRoutes, setAvailableRoutes] = useState<{[key: string]: string[]}>({});
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableRoutes();
  }, []);

  useEffect(() => {
    if (searchData.from && availableRoutes[searchData.from]) {
      setDestinations(availableRoutes[searchData.from]);
      // Reset destination if it's no longer available
      if (!availableRoutes[searchData.from].includes(searchData.to)) {
        setSearchData(prev => ({ ...prev, to: '' }));
      }
    } else {
      setDestinations([]);
      setSearchData(prev => ({ ...prev, to: '' }));
    }
  }, [searchData.from, availableRoutes]);

  const fetchAvailableRoutes = async () => {
    setLoading(true);
    try {
      // Session is optional for this public endpoint; include token only if available
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      // Call the public flights route (server returns { flights: [...] })
      let response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/flights`, {
        headers,
      });

      if (response.status === 401) {
        // retry without auth header - endpoint is public in your server code
        response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/flights`);
      }

      if (response.ok) {
        const data: any = await response.json();
        const flights: any[] = data.flights || [];

        // Convert flights array into a mapping of origin -> [destinations]
        const routes: { [key: string]: string[] } = {};
        flights.forEach((f) => {
          const from = f.from || f.fromCode || 'Unknown';
          const to = f.to || f.toCode || 'Unknown';
          if (!routes[from]) routes[from] = [];
          if (!routes[from].includes(to)) routes[from].push(to);
        });

        setAvailableRoutes(routes);
        setOrigins(Object.keys(routes));
      } else {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch routes');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchData.from || !searchData.to || !searchData.departDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (searchData.tripType === 'round-trip' && !searchData.returnDate) {
      alert('Please select return date for round trip');
      return;
    }

    onSearch(searchData);
  };

  const updatePassengers = (type: 'adults' | 'children', increment: boolean) => {
    setSearchData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: increment 
          ? Math.min(prev.passengers[type] + 1, 9)
          : Math.max(prev.passengers[type] - 1, type === 'adults' ? 1 : 0)
      }
    }));
  };

  const swapDestinations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Search Flights</h1>
            <p className="text-red-100">Find your perfect journey</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-4 pb-8">
        <Card className="w-full max-w-4xl mx-auto shadow-xl border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-2">
              <Plane className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Book Your Flight</h2>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <Button
                  type="button"
                  variant={searchData.tripType === 'one-way' ? 'default' : 'ghost'}
                  className={`text-sm font-medium ${
                    searchData.tripType === 'one-way' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                  onClick={() => setSearchData(prev => ({ ...prev, tripType: 'one-way', returnDate: '' }))}
                >
                  One Way
                </Button>
                <Button
                  type="button"
                  variant={searchData.tripType === 'round-trip' ? 'default' : 'ghost'}
                  className={`text-sm font-medium ${
                    searchData.tripType === 'round-trip' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                  onClick={() => setSearchData(prev => ({ ...prev, tripType: 'round-trip' }))}
                >
                  Round Trip
                </Button>
              </div>

              {/* Destinations */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* From */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">From</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                        <Select
                          value={searchData.from}
                          onValueChange={(value: string) => setSearchData(prev => ({ ...prev, from: value }))}
                          disabled={loading}
                        >
                          <SelectTrigger className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500">
                            <SelectValue placeholder={loading ? "Loading origins..." : "Select origin city"} />
                          </SelectTrigger>
                          <SelectContent>
                            {origins.map((origin) => (
                              <SelectItem key={origin} value={origin}>
                                {origin}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* To */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">To</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                        <Select
                          value={searchData.to}
                          onValueChange={(value: string) => setSearchData(prev => ({ ...prev, to: value }))}
                          disabled={!searchData.from || destinations.length === 0}
                        >
                          <SelectTrigger className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500">
                            <SelectValue placeholder={
                              !searchData.from 
                                ? "Select origin first" 
                                : destinations.length === 0 
                                  ? "No destinations available" 
                                  : "Select destination city"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {destinations.map((destination) => (
                              <SelectItem key={destination} value={destination}>
                                {destination}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={swapDestinations}
                      disabled={!searchData.from || !searchData.to}
                      className="rounded-full w-10 h-10 p-0 border-2 border-gray-300 bg-white hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                    >
                      <ArrowRight className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>

                  {/* Mobile Swap Button */}
                  <div className="sm:hidden mt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={swapDestinations}
                      disabled={!searchData.from || !searchData.to}
                      className="w-full border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Swap Destinations
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Departure Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="date"
                      value={searchData.departDate}
                      min={getTodayDate()}
                      onChange={(e) => setSearchData(prev => ({ ...prev, departDate: e.target.value }))}
                      className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                {searchData.tripType === 'round-trip' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Return Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="date"
                        value={searchData.returnDate}
                        min={searchData.departDate || getTodayDate()}
                        onChange={(e) => setSearchData(prev => ({ ...prev, returnDate: e.target.value }))}
                        className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Passengers</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Adults */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Adults</p>
                        <p className="text-sm text-gray-600">12+ years</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updatePassengers('adults', false)}
                          disabled={searchData.passengers.adults <= 1}
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          -
                        </Button>
                        <span className="text-lg font-semibold w-6 text-center">{searchData.passengers.adults}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updatePassengers('adults', true)}
                          disabled={searchData.passengers.adults >= 9}
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Children</p>
                        <p className="text-sm text-gray-600">2-11 years</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updatePassengers('children', false)}
                          disabled={searchData.passengers.children <= 0}
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          -
                        </Button>
                        <span className="text-lg font-semibold w-6 text-center">{searchData.passengers.children}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updatePassengers('children', true)}
                          disabled={searchData.passengers.children >= 9}
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class Type */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'economy', label: 'Economy', desc: 'Great value', icon: '💺' },
                    { value: 'business', label: 'Business', desc: 'Extra comfort', icon: '🥂' },
                    { value: 'first', label: 'First Class', desc: 'Ultimate luxury', icon: '👑' }
                  ].map((classOption) => (
                    <div
                      key={classOption.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        searchData.classType === classOption.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-white hover:border-red-300'
                      }`}
                      onClick={() => setSearchData(prev => ({ ...prev, classType: classOption.value as any }))}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{classOption.icon}</div>
                        <p className="font-semibold text-gray-900">{classOption.label}</p>
                        <p className="text-sm text-gray-600">{classOption.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
              >
                <Plane className="mr-3 h-5 w-5" />
                Search Flights
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}