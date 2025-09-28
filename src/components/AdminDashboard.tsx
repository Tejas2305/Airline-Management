import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Edit, 
  Plane, 
  BarChart3, 
  Users, 
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { supabase, supabaseUrl } from '../utils/supabaseClient';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
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

interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  classRevenue: {
    economy: number;
    business: number;
    first: number;
  };
  flightStats: Array<{
    flightNumber: string;
    occupancyRate: string;
    revenue: number;
  }>;
  averageBookingValue: string;
}

interface AdminDashboardProps {
  user: User;
  onNavigate: (page: any) => void;
}

export function AdminDashboard({ user, onNavigate }: AdminDashboardProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [isAddingFlight, setIsAddingFlight] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    flightNumber: '',
    from: '',
    to: '',
    fromCode: '',
    toCode: '',
    departure: '',
    arrival: '',
    duration: '',
    aircraft: '',
    date: '',
    economy: { price: 0, available: 150 },
    business: { price: 0, available: 20 },
    first: { price: 0, available: 8 },
    stops: 'non-stop'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Always use the server function for flights to avoid relying on a Postgres table that may not exist
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const flightHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) flightHeaders['Authorization'] = `Bearer ${accessToken}`;

      let flightsResponse = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/flights`, {
        headers: flightHeaders,
      });

      // If the token is invalid we may get a 401; retry without Authorization (the endpoint is public in your server code)
      if (flightsResponse.status === 401) {
        console.warn('Flights API returned 401 with provided token — retrying without Authorization header');
        flightsResponse = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/flights`);
      }

      if (flightsResponse.ok) {
        const flightsData = await flightsResponse.json();
        setFlights(flightsData.flights || []);
      } else {
        console.error('Failed to fetch flights from API', flightsResponse.status, await flightsResponse.text().catch(() => ''));
        setFlights([]);
      }

      // Fetch analytics only for admin users
      if (user?.role === 'admin' && accessToken) {
        const analyticsResponse = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/admin/analytics`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setAnalytics(analyticsData);
        } else {
          setAnalytics({
            totalRevenue: 0,
            totalBookings: 0,
            classRevenue: { economy: 0, business: 0, first: 0 },
            flightStats: [],
            averageBookingValue: '0'
          });
        }
      } else {
        setAnalytics({
          totalRevenue: 0,
          totalBookings: 0,
          classRevenue: { economy: 0, business: 0, first: 0 },
          flightStats: [],
          averageBookingValue: '0'
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load flight data. Please check your connection.');
      setFlights([]);
      setAnalytics({
        totalRevenue: 0,
        totalBookings: 0,
        classRevenue: {
          economy: 0,
          business: 0,
          first: 0
        },
        flightStats: [],
        averageBookingValue: '0'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFlightData = () => {
    const errors: string[] = [];
    if (!newFlight.flightNumber?.trim()) errors.push('Flight Number');
    if (!newFlight.from?.trim()) errors.push('From City');
    if (!newFlight.to?.trim()) errors.push('To City');
    if (!newFlight.departure?.trim()) errors.push('Departure Time');
    if (!newFlight.arrival?.trim()) errors.push('Arrival Time');
    if (!newFlight.date) errors.push('Date');
    if (!newFlight.aircraft?.trim()) errors.push('Aircraft');
    if (!newFlight.economy || (newFlight.economy.price ?? 0) <= 0) errors.push('Economy Price');
    if (!newFlight.business || (newFlight.business.price ?? 0) <= 0) errors.push('Business Price');
    if (!newFlight.first || (newFlight.first.price ?? 0) <= 0) errors.push('First Class Price');
    return errors;
  };

  const handleAddFlight = async () => {
    setIsSubmitting(true);
    try {
      const errors = validateFlightData();
      if (errors.length) {
        toast.error('Please fill in: ' + errors.join(', '));
        return;
      }

      // Normalize flight payload
      const flightData = {
        ...newFlight,
        economy: { price: Number(newFlight.economy?.price ?? 0), available: Number(newFlight.economy?.available ?? 150) },
        business: { price: Number(newFlight.business?.price ?? 0), available: Number(newFlight.business?.available ?? 20) },
        first: { price: Number(newFlight.first?.price ?? 0), available: Number(newFlight.first?.available ?? 8) },
      } as Partial<Flight>;

      // Use admin function to add flight (server uses KV store)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('You must be logged in as an admin to add flights.');
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/admin/flights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(flightData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData && (errorData.error || errorData.message)) || 'Failed to add flight');
      }

      console.log('Flight added via API');

      // Refresh and reset
      await fetchData();
      setIsAddingFlight(false);
      setNewFlight({
        flightNumber: '',
        from: '',
        to: '',
        fromCode: '',
        toCode: '',
        departure: '',
        arrival: '',
        duration: '',
        aircraft: '',
        date: '',
        economy: { price: 0, available: 150 },
        business: { price: 0, available: 20 },
        first: { price: 0, available: 8 },
        stops: 'non-stop'
      });

      toast.success('Flight added successfully!');
    } catch (error) {
      console.error('Error adding flight:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add flight. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFlight = async () => {
    if (!editingFlight) return;
    
    // Validate price data
    if (editingFlight.economy.price <= 0 || editingFlight.business.price <= 0 || editingFlight.first.price <= 0) {
      toast.error('All prices must be greater than 0');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call admin function to update flight (server uses KV store)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('You must be logged in as an admin to update flights.');
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/admin/flights/${editingFlight.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(editingFlight),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData && (errorData.error || errorData.message)) || 'Failed to update flight');
      }

      console.log('Flight updated via API');

      await fetchData();
      setEditingFlight(null);
      toast.success('Flight updated successfully!');
      
    } catch (error) {
      console.error('Error updating flight:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update flight. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Manage flights, fares, and view analytics</p>
          </div>

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(analytics.totalRevenue)}
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-full p-3">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-600">{analytics.totalBookings}</p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg Booking Value</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${analytics.averageBookingValue}
                      </p>
                    </div>
                    <div className="bg-purple-100 rounded-full p-3">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Active Flights</p>
                      <p className="text-2xl font-bold text-red-600">{flights.length}</p>
                    </div>
                    <div className="bg-red-100 rounded-full p-3">
                      <Plane className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-red-50 mb-6">
              <TabsTrigger value="flights" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Flight Management
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Flight Management Tab */}
            <TabsContent value="flights" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Flight Management</h2>
                <Dialog open={isAddingFlight} onOpenChange={setIsAddingFlight}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Flight
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Flight</DialogTitle>
                      <DialogDescription>
                        Fill in all flight details to add a new flight to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Flight Number</label>
                        <Input
                          value={newFlight.flightNumber}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, flightNumber: e.target.value }))}
                          placeholder="GA001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Aircraft</label>
                        <Input
                          value={newFlight.aircraft}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, aircraft: e.target.value }))}
                          placeholder="Boeing 777"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">From City</label>
                        <Input
                          value={newFlight.from}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, from: e.target.value }))}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">From Code</label>
                        <Input
                          value={newFlight.fromCode}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, fromCode: e.target.value }))}
                          placeholder="JFK"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">To City</label>
                        <Input
                          value={newFlight.to}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, to: e.target.value }))}
                          placeholder="Los Angeles"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">To Code</label>
                        <Input
                          value={newFlight.toCode}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, toCode: e.target.value }))}
                          placeholder="LAX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Departure Time</label>
                        <Input
                          value={newFlight.departure}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, departure: e.target.value }))}
                          placeholder="08:00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Arrival Time</label>
                        <Input
                          value={newFlight.arrival}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, arrival: e.target.value }))}
                          placeholder="11:30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration</label>
                        <Input
                          value={newFlight.duration}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="5h 30m"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Flight Date</label>
                        <Input
                          type="date"
                          value={newFlight.date}
                          min={getTodayDate()}
                          onChange={(e) => setNewFlight(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Economy Price</label>
                        <Input
                          type="number"
                          value={newFlight.economy?.price}
                          onChange={(e) => setNewFlight(prev => ({ 
                            ...prev, 
                            economy: { ...prev.economy!, price: Number(e.target.value) }
                          }))}
                          placeholder="299"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Business Price</label>
                        <Input
                          type="number"
                          value={newFlight.business?.price}
                          onChange={(e) => setNewFlight(prev => ({ 
                            ...prev, 
                            business: { ...prev.business!, price: Number(e.target.value) }
                          }))}
                          placeholder="899"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">First Class Price</label>
                        <Input
                          type="number"
                          value={newFlight.first?.price}
                          onChange={(e) => setNewFlight(prev => ({ 
                            ...prev, 
                            first: { ...prev.first!, price: Number(e.target.value) }
                          }))}
                          placeholder="1599"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Stops</label>
                        <Select 
                          value={newFlight.stops} 
                          onValueChange={(value: string) => setNewFlight(prev => ({ ...prev, stops: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non-stop">Non-stop</SelectItem>
                            <SelectItem value="1-stop">1 Stop</SelectItem>
                            <SelectItem value="2-stops">2 Stops</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddingFlight(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddFlight} 
                        disabled={isSubmitting}
                        className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding Flight...
                          </>
                        ) : (
                          'Add Flight'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Flights Table */}
              <div className="grid gap-4">
                {flights.map((flight) => (
                  <Card key={flight.id} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                          <div>
                            <h3 className="font-semibold text-gray-900">{flight.flightNumber}</h3>
                            <p className="text-sm text-gray-600">{flight.aircraft}</p>
                          </div>
                          <div>
                            <p className="font-medium">{flight.from} → {flight.to}</p>
                            <p className="text-sm text-gray-600">{flight.fromCode} → {flight.toCode}</p>
                          </div>
                          <div>
                            <p className="font-medium">{flight.departure} - {flight.arrival}</p>
                            <p className="text-sm text-gray-600">{flight.duration}</p>
                          </div>
                          <div>
                            <p className="font-medium">{flight.date}</p>
                            <Badge className={flight.stops === 'non-stop' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                              {flight.stops}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingFlight(flight)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl">
                              <DialogHeader>
                                <DialogTitle>Edit Flight Prices</DialogTitle>
                                <DialogDescription>
                                  Update the pricing for different class types for this flight.
                                </DialogDescription>
                              </DialogHeader>
                              {editingFlight && (
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Economy</label>
                                      <Input
                                        type="number"
                                        value={editingFlight.economy.price}
                                        onChange={(e) => setEditingFlight(prev => prev ? {
                                          ...prev,
                                          economy: { ...prev.economy, price: Number(e.target.value) }
                                        } : null)}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Business</label>
                                      <Input
                                        type="number"
                                        value={editingFlight.business.price}
                                        onChange={(e) => setEditingFlight(prev => prev ? {
                                          ...prev,
                                          business: { ...prev.business, price: Number(e.target.value) }
                                        } : null)}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">First Class</label>
                                      <Input
                                        type="number"
                                        value={editingFlight.first.price}
                                        onChange={(e) => setEditingFlight(prev => prev ? {
                                          ...prev,
                                          first: { ...prev.first, price: Number(e.target.value) }
                                        } : null)}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setEditingFlight(null)}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={handleUpdateFlight} 
                                      disabled={isSubmitting}
                                      className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="h-4 w-4 mr-2" />
                                          Save Changes
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      {/* Price breakdown */}
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Economy</p>
                          <p className="font-semibold">${flight.economy.price}</p>
                          <p className="text-xs text-gray-500">{flight.economy.available} seats</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Business</p>
                          <p className="font-semibold">${flight.business.price}</p>
                          <p className="text-xs text-gray-500">{flight.business.available} seats</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">First Class</p>
                          <p className="font-semibold">${flight.first.price}</p>
                          <p className="text-xs text-gray-500">{flight.first.available} seats</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Analytics</h2>
              
              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Class Revenue Breakdown */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Revenue by Class</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Economy Class</span>
                          <span className="font-semibold">{formatCurrency(analytics.classRevenue.economy)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Business Class</span>
                          <span className="font-semibold">{formatCurrency(analytics.classRevenue.business)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>First Class</span>
                          <span className="font-semibold">{formatCurrency(analytics.classRevenue.first)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flight Performance */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Flight Performance</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.flightStats.slice(0, 5).map((stat) => (
                          <div key={stat.flightNumber} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{stat.flightNumber}</span>
                              <p className="text-sm text-gray-600">{stat.occupancyRate}% occupancy</p>
                            </div>
                            <span className="font-semibold">{formatCurrency(stat.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <h3 className="text-lg font-semibold">General Settings</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Booking Window (days)</label>
                    <Input type="number" defaultValue="365" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cancellation Policy (hours)</label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Window (hours)</label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}