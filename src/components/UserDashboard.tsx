import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight,
  Plane,
  Shield,
  Award
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

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

interface UserDashboardProps {
  user: User;
  onNavigate: (page: AppPage) => void;
}

export function UserDashboard({ user, onNavigate }: UserDashboardProps) {
  const quickDestinations = [
    { city: 'New York', code: 'JFK', price: 299, image: '🗽' },
    { city: 'Los Angeles', code: 'LAX', price: 349, image: '🌴' },
    { city: 'Miami', code: 'MIA', price: 249, image: '🏖️' },
    { city: 'Chicago', code: 'ORD', price: 199, image: '🏙️' },
    { city: 'Seattle', code: 'SEA', price: 279, image: '🌲' },
    { city: 'Boston', code: 'BOS', price: 229, image: '🦞' }
  ];

  const features = [
    {
      icon: Shield,
      title: "Travel Insurance",
      description: "Comprehensive coverage for peace of mind",
      action: "Learn More"
    },
    {
      icon: Award,
      title: "Galaxy Miles",
      description: "Earn points and unlock exclusive rewards",
      action: "Join Now"
    },
    {
      icon: Star,
      title: "Premium Support",
      description: "24/7 dedicated customer assistance",
      action: "Contact Us"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-lg text-gray-600">Ready for your next adventure?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Book a Flight</h2>
                  <p className="text-red-100 mb-4">Find and book your perfect journey</p>
                  <Button 
                    onClick={() => onNavigate('flight-search')}
                    className="bg-white text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search Flights
                  </Button>
                </div>
                <div className="text-8xl opacity-20">
                  <Plane className="h-20 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h2>
                  <p className="text-gray-600 mb-4">View and manage your reservations</p>
                  <Button 
                    onClick={() => onNavigate('my-bookings')}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    View Bookings
                  </Button>
                </div>
                <div className="text-8xl opacity-10">
                  <Calendar className="h-20 w-20 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Destinations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('flight-search')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickDestinations.map((destination, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-3">{destination.image}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{destination.city}</h3>
                  <p className="text-sm text-gray-600 mb-2">{destination.code}</p>
                  <Badge className="bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    from ${destination.price}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enhanced Travel Experience</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-red-100 rounded-full p-3 w-12 h-12 mb-4">
                    <feature.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Button 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0"
                  >
                    {feature.action} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Tips & Updates</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-600 rounded-full p-1 mt-1">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Check-in Online</h4>
                      <p className="text-sm text-gray-600">Save time by checking in 24 hours before departure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-600 rounded-full p-1 mt-1">
                      <MapPin className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Travel Requirements</h4>
                      <p className="text-sm text-gray-600">Check visa and vaccination requirements for your destination</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-600 rounded-full p-1 mt-1">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Premium Services</h4>
                      <p className="text-sm text-gray-600">Upgrade to business class for enhanced comfort</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Special Offer</h3>
                  <div className="text-4xl font-bold text-red-600 mb-2">30% OFF</div>
                  <p className="text-gray-600 mb-4">on your next international flight</p>
                  <Button 
                    onClick={() => onNavigate('flight-search')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}