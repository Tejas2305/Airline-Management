import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ArrowLeft, 
  Calendar, 
  Plane, 
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase, supabaseUrl } from '../utils/supabaseClient';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface Booking {
  id: string;
  searchData: {
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
  };
  selectedFlight: {
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
  };
  returnFlight?: {
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
  };
  passengers: Array<{
    name: string;
    phone: string;
    email: string;
    address: string;
  }>;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

interface MyBookingsProps {
  user: User;
  onBack: () => void;
}

export function MyBookings({ user, onBack }: MyBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/user-bookings`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        } else {
          console.error('Failed to fetch bookings');
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.selectedFlight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.searchData.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.searchData.to.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'completed': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBookingDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalPassengers = (booking: Booking) => {
    return booking.searchData.passengers.adults + booking.searchData.passengers.children;
  };

  const handleViewDetails = (booking: Booking) => {
    // Mock function - in real app would navigate to booking details
    alert(`Viewing details for booking ${booking.id}`);
  };

  const handleDownloadTicket = (booking: Booking) => {
    // Mock function - in real app would download ticket
    alert(`Downloading ticket for booking ${booking.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">My Bookings</h1>
              <p className="text-sm text-gray-600">Manage your flight reservations</p>
            </div>

            <Button 
              variant="outline" 
              onClick={fetchBookings}
              className="p-2"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by booking ID, flight number, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'confirmed', 'cancelled', 'completed'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status as any)}
                  className={`capitalize ${
                    statusFilter === status 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{bookings.length}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">
                  ${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </CardContent>
            </Card>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No bookings found' : 'No bookings yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Book your first flight to see it here'
                  }
                </p>
                {(!searchTerm && statusFilter === 'all') && (
                  <Button onClick={onBack} className="bg-red-600 hover:bg-red-700 text-white">
                    Book a Flight
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Booking Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Booking #{booking.id.slice(-8)}
                            </h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Booked on {formatBookingDate(booking.bookingDate)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(booking)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadTicket(booking)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Outbound Flight */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Plane className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-gray-900">Outbound Flight</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{booking.selectedFlight.flightNumber}</span>
                              <span className="text-sm text-gray-600">{booking.selectedFlight.aircraft}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <p className="font-semibold">{booking.selectedFlight.departure}</p>
                                <p className="text-sm text-gray-600">{booking.selectedFlight.fromCode}</p>
                              </div>
                              <div className="text-center flex-1 mx-4">
                                <div className="border-t border-gray-300 relative">
                                  <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-red-600 bg-gray-50" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{booking.selectedFlight.duration}</p>
                              </div>
                              <div className="text-center">
                                <p className="font-semibold">{booking.selectedFlight.arrival}</p>
                                <p className="text-sm text-gray-600">{booking.selectedFlight.toCode}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatDate(booking.searchData.departDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Return Flight (if applicable) */}
                        {booking.returnFlight && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Plane className="h-4 w-4 text-red-600 rotate-180" />
                              <span className="font-medium text-gray-900">Return Flight</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">{booking.returnFlight.flightNumber}</span>
                                <span className="text-sm text-gray-600">{booking.returnFlight.aircraft}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-center">
                                  <p className="font-semibold">{booking.returnFlight.departure}</p>
                                  <p className="text-sm text-gray-600">{booking.returnFlight.fromCode}</p>
                                </div>
                                <div className="text-center flex-1 mx-4">
                                  <div className="border-t border-gray-300 relative">
                                    <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-red-600 bg-gray-50" />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{booking.returnFlight.duration}</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-semibold">{booking.returnFlight.arrival}</p>
                                  <p className="text-sm text-gray-600">{booking.returnFlight.toCode}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {formatDate(booking.searchData.returnDate || '')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Booking Summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-4 text-center sm:text-left mb-4 sm:mb-0">
                          <div>
                            <p className="text-sm text-gray-600">Passengers</p>
                            <p className="font-semibold">{getTotalPassengers(booking)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Class</p>
                            <p className="font-semibold capitalize">{booking.searchData.classType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-semibold text-red-600">${booking.totalPrice}</p>
                          </div>
                        </div>
                        
                        <div className="text-center sm:text-right">
                          <p className="text-sm text-gray-600">Payment</p>
                          <p className="font-semibold capitalize">{booking.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}