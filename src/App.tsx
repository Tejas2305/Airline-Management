import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { FlightSearch } from './components/FlightSearch';
import { FlightResults } from './components/FlightResults';
import { BookingReview } from './components/BookingReview';
import { PassengerDetails } from './components/PassengerDetails';
import { PaymentPage } from './components/PaymentPage';
import { BookingConfirmation } from './components/BookingConfirmation';
import { MyBookings } from './components/MyBookings';
import { supabase } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type AppPage = 
  | 'landing'
  | 'login' 
  | 'user-dashboard'
  | 'admin-dashboard'
  | 'flight-search'
  | 'flight-results'
  | 'booking-review'
  | 'passenger-details'
  | 'payment'
  | 'booking-confirmation'
  | 'my-bookings';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

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

interface BookingData {
  searchData: FlightSearchData;
  selectedFlight: Flight;
  returnFlight?: Flight;
  passengers: Array<{
    name: string;
    phone: string;
    email: string;
    address: string;
  }>;
  totalPrice: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<FlightSearchData | null>(null);
  const [selectedFlights, setSelectedFlights] = useState<{outbound: Flight | null, return: Flight | null}>({
    outbound: null,
    return: null
  });
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if admin (you can set this during signup or have a predefined admin email)
        const isAdmin = session.user.email === 'admin@galaxy.com';
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          role: isAdmin ? 'admin' : 'user'
        });
        
        setCurrentPage(isAdmin ? 'admin-dashboard' : 'user-dashboard');
      } else {
        setCurrentPage('landing');
      }
    } catch (error) {
      console.error('Session check error:', error);
      setCurrentPage('landing');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      // Sign in via Supabase to obtain a real session and access token
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      if (!session?.user) {
        // If login didn't create a session (for demo admin), try to create via server function
        if (email === 'admin@galaxy.com') {
          try {
            const { supabaseUrl } = await import('./utils/supabaseClient');
            const res = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/signup`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, name: 'Galaxy Admin' }),
            });

            if (res.ok) {
              toast.success('Admin demo account created — please sign in again');
            } else {
              toast.error('Admin demo signup failed — using local demo session');
            }
          } catch (err) {
            toast.error('Admin demo setup failed — using local demo session');
          }

          // Fallback to local simulated admin session (development only)
          setUser({ id: 'admin-id', email: 'admin@galaxy.com', name: 'Galaxy Admin', role: 'admin' });
          setCurrentPage('admin-dashboard');
          return;
        }

        throw new Error('Login failed - no session returned');
      }

      const isAdmin = session.user.email === 'admin@galaxy.com';
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || 'User',
        role: isAdmin ? 'admin' : 'user'
      });
      setCurrentPage(isAdmin ? 'admin-dashboard' : 'user-dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      const { supabaseUrl } = await import('./utils/supabaseClient');
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // signup likely does not require anon key in this flow; remove publicAnonKey
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      await handleLogin(email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentPage('landing');
      setSearchData(null);
      setSelectedFlights({ outbound: null, return: null });
      setBookingData(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleFlightSearch = (data: FlightSearchData) => {
    setSearchData(data);
    setCurrentPage('flight-results');
  };

  const handleFlightSelect = (flight: Flight, type: 'outbound' | 'return') => {
    setSelectedFlights(prev => ({
      ...prev,
      [type]: flight
    }));

    // If it's a one-way trip or both flights are selected, go to review
    if (searchData?.tripType === 'one-way' || (type === 'return' && selectedFlights.outbound)) {
      setCurrentPage('booking-review');
    }
  };

  const handleBookingReview = (passengerData: Array<{name: string; phone: string; email: string; address: string}>) => {
    if (!searchData || !selectedFlights.outbound) return;

    const totalPrice = calculateTotalPrice();
    
    setBookingData({
      searchData,
      selectedFlight: selectedFlights.outbound,
      returnFlight: selectedFlights.return || undefined,
      passengers: passengerData,
      totalPrice
    });
    
    setCurrentPage('payment');
  };

  const calculateTotalPrice = (): number => {
    if (!searchData || !selectedFlights.outbound) return 0;
    
    const outboundPrice = selectedFlights.outbound[searchData.classType].price;
    const returnPrice = selectedFlights.return ? selectedFlights.return[searchData.classType].price : 0;
    const totalPassengers = searchData.passengers.adults + searchData.passengers.children;
    
    return (outboundPrice + returnPrice) * totalPassengers;
  };

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-red-600 text-xl font-medium">Loading Galaxy Airlines...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        user={user} 
        onLogout={handleLogout}
        onNavigate={navigateTo}
        currentPage={currentPage}
      />
      <Toaster />
      
      {currentPage === 'landing' && (
        <LandingPage onNavigate={navigateTo} />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onSignup={handleSignup}
          onBack={() => navigateTo('landing')}
        />
      )}
      
      {currentPage === 'user-dashboard' && user && user.role === 'user' && (
        <UserDashboard 
          user={user}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'admin-dashboard' && user && user.role === 'admin' && (
        <AdminDashboard 
          user={user}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'flight-search' && (
        <FlightSearch 
          onSearch={handleFlightSearch}
          onBack={() => navigateTo(user ? 'user-dashboard' : 'landing')}
        />
      )}
      
      {currentPage === 'flight-results' && searchData && (
        <FlightResults 
          searchData={searchData}
          selectedFlights={selectedFlights}
          onFlightSelect={handleFlightSelect}
          onBack={() => navigateTo('flight-search')}
        />
      )}
      
      {currentPage === 'booking-review' && searchData && selectedFlights.outbound && (
        <BookingReview 
          searchData={searchData}
          selectedFlights={selectedFlights}
          totalPrice={calculateTotalPrice()}
          onContinue={() => navigateTo('passenger-details')}
          onBack={() => navigateTo('flight-results')}
        />
      )}
      
      {currentPage === 'passenger-details' && searchData && (
        <PassengerDetails 
          searchData={searchData}
          onContinue={handleBookingReview}
          onBack={() => navigateTo('booking-review')}
        />
      )}
      
      {currentPage === 'payment' && bookingData && (
        <PaymentPage 
          bookingData={bookingData}
          onPaymentComplete={() => navigateTo('booking-confirmation')}
          onBack={() => navigateTo('passenger-details')}
        />
      )}
      
      {currentPage === 'booking-confirmation' && bookingData && (
        <BookingConfirmation 
          bookingData={bookingData}
          onBackToHome={() => navigateTo('user-dashboard')}
        />
      )}
      
      {currentPage === 'my-bookings' && user && (
        <MyBookings 
          user={user}
          onBack={() => navigateTo('user-dashboard')}
        />
      )}
    </div>
  );
}