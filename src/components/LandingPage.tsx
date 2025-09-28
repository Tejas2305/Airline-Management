import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Plane, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Users, 
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

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

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const tourPackages = [
    {
      id: 1,
      title: "Tropical Paradise Getaway",
      destination: "Maldives • 7 Days",
      price: 2999,
      originalPrice: 3999,
      image: "https://images.unsplash.com/photo-1736524972348-85c310d7815b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHZhY2F0aW9uJTIwdHJvcGljYWx8ZW58MXx8fHwxNzU4OTcxMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlights: ["Beach Resort", "All Inclusive", "Spa Access"],
      rating: 4.9
    },
    {
      id: 2,
      title: "European Grand Tour",
      destination: "Paris • Rome • London • 14 Days",
      price: 4999,
      originalPrice: 6499,
      image: "https://images.unsplash.com/photo-1758351820488-8cadd8fde79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWwlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NTg5MDA4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlights: ["Historic Tours", "First Class", "Luxury Hotels"],
      rating: 4.8
    },
    {
      id: 3,
      title: "Adventure Safari",
      destination: "Kenya • Tanzania • 10 Days",
      price: 3799,
      originalPrice: 4999,
      image: "https://images.unsplash.com/photo-1758351820488-8cadd8fde79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWwlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NTg5MDA4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      highlights: ["Wildlife Safari", "Expert Guides", "Luxury Camps"],
      rating: 4.9
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Advanced safety measures and secure booking"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Best airline service 2024"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance"
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Luxury comfort in every journey"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight">
                Experience the Stars with 
                <span className="block text-red-200">Every Journey</span>
              </h1>
              <p className="text-xl text-red-100">
                Discover the world with Galaxy Airlines. Premium comfort, 
                exceptional service, and unforgettable experiences await you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => onNavigate('login')}
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-4"
                >
                  Book Your Flight
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-4"
                >
                  Explore Packages
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-red-400/30">
                <div className="text-center">
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-red-200">Destinations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50M+</div>
                  <div className="text-red-200">Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.9</div>
                  <div className="text-red-200">Star Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560507571-800cfead6657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMGZseWluZyUyMGNsb3Vkc3xlbnwxfHx8fDE3NTg5MTcwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Galaxy Airlines Aircraft"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 rounded-full p-2">
                    <Plane className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Premium Fleet</div>
                    <div className="text-sm text-gray-600">Modern & Comfortable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Galaxy Airlines?</h2>
            <p className="text-xl text-gray-600">Experience unparalleled service and comfort</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Tour Packages</h2>
            <p className="text-xl text-gray-600">Handpicked destinations for unforgettable experiences</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourPackages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <ImageWithFallback
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                    Save ${pkg.originalPrice - pkg.price}
                  </Badge>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{pkg.destination}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-red-600">${pkg.price}</span>
                        <span className="text-lg text-gray-400 line-through">${pkg.originalPrice}</span>
                      </div>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                    <Button 
                      onClick={() => onNavigate('login')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Special Offers & Promotions
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-600 rounded-full p-2 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Early Bird Discount</h3>
                    <p className="text-gray-600">Book 60 days in advance and save up to 30% on international flights.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-red-600 rounded-full p-2 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Package</h3>
                    <p className="text-gray-600">Travel with family and get exclusive discounts on group bookings.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-red-600 rounded-full p-2 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loyalty Rewards</h3>
                    <p className="text-gray-600">Join Galaxy Miles and earn points on every flight for future rewards.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                size="lg"
                onClick={() => onNavigate('login')}
                className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-4"
              >
                Explore All Offers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                  <Calendar className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Limited Time Offer</h3>
                <p className="text-4xl font-bold text-red-600 mb-2">50% OFF</p>
                <p className="text-gray-600 mb-6">on your first international booking</p>
                <p className="text-sm text-gray-500 mb-6">Use code: GALAXY50</p>
                <Button 
                  onClick={() => onNavigate('login')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Claim Offer Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join millions of travelers who trust Galaxy Airlines for their adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onNavigate('login')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4"
            >
              Book Your Flight Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}