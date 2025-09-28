import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Plane, 
  Calendar,
  MapPin,
  Users,
  Home,
  Share,
  FileText
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

interface BookingConfirmationProps {
  bookingData: BookingData;
  onBackToHome: () => void;
}

export function BookingConfirmation({ bookingData, onBackToHome }: BookingConfirmationProps) {
  const bookingReference = `GA${Date.now().toString().slice(-8)}`;

  const getTotalPassengers = () => {
    return bookingData.searchData.passengers.adults + bookingData.searchData.passengers.children;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadTicket = () => {
    // Mock download functionality
    alert('Ticket download will be available soon. Check your email for the confirmation.');
  };

  const handleEmailTicket = () => {
    alert('Confirmation email sent to your registered email address.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Galaxy Airlines Booking Confirmation',
        text: `Flight booking confirmed! Reference: ${bookingReference}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Flight booking confirmed! Reference: ${bookingReference}`);
      alert('Booking details copied to clipboard!');
    }
  };

  const FlightCard = ({ flight, type }: { flight: Flight, type: 'outbound' | 'return' }) => (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Flight Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Plane className={`h-4 w-4 text-red-600 ${type === 'return' ? 'rotate-180' : ''}`} />
                <span className="font-semibold text-gray-900">{type === 'outbound' ? 'Outbound' : 'Return'}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{flight.flightNumber}</h3>
              <p className="text-sm text-gray-600">{flight.aircraft}</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
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
                <p className="text-xs text-gray-500">{flight.stops}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{flight.arrival}</p>
              <p className="text-sm text-gray-600">{flight.toCode}</p>
              <p className="text-xs text-gray-500">{flight.to}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatDate(type === 'outbound' ? bookingData.searchData.departDate : bookingData.searchData.returnDate || '')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-green-100 mb-6">
              Your flight has been successfully booked
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-sm text-green-100 mb-1">Booking Reference</p>
              <p className="text-2xl font-bold">{bookingReference}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={handleDownloadTicket}
              className="flex flex-col items-center gap-2 h-auto py-4 border-gray-300 hover:border-red-300 hover:bg-red-50"
            >
              <Download className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Download</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleEmailTicket}
              className="flex flex-col items-center gap-2 h-auto py-4 border-gray-300 hover:border-red-300 hover:bg-red-50"
            >
              <Mail className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Email</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="flex flex-col items-center gap-2 h-auto py-4 border-gray-300 hover:border-red-300 hover:bg-red-50"
            >
              <Share className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Share</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="flex flex-col items-center gap-2 h-auto py-4 border-gray-300 hover:border-red-300 hover:bg-red-50"
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Print</span>
            </Button>
          </div>

          {/* Booking Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-red-600 text-white">
              <h2 className="text-xl font-semibold">Booking Details</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Booking Reference</p>
                  <p className="font-bold text-lg">{bookingReference}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Total Passengers</p>
                  <p className="font-bold text-lg">{getTotalPassengers()}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-bold text-lg capitalize">{bookingData.searchData.classType}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="font-bold text-lg text-red-600">${bookingData.totalPrice}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Passenger List */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Passengers</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookingData.passengers.map((passenger, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{passenger.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{passenger.email}</p>
                        <p>{passenger.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Flight Information</h2>
            
            {/* Outbound Flight */}
            <FlightCard flight={bookingData.selectedFlight} type="outbound" />
            
            {/* Return Flight */}
            {bookingData.returnFlight && (
              <FlightCard flight={bookingData.returnFlight} type="return" />
            )}
          </div>

          {/* Important Information */}
          <Card className="border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Check-in:</strong> Opens 24 hours before departure. Complete online check-in to save time.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Airport Arrival:</strong> Arrive at least 2 hours before domestic flights, 3 hours for international.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Documentation:</strong> Bring valid photo ID and any required travel documents.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Changes:</strong> Modifications can be made up to 24 hours before departure (fees may apply).</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Contact:</strong> For assistance, call our 24/7 support at 1-800-GALAXY-1.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confirmation Email Sent</p>
                    <p className="text-sm text-gray-600">Check your email for detailed booking information</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Online Check-in (24h before)</p>
                    <p className="text-sm text-gray-600">Complete check-in and get your boarding pass</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Arrive at Airport</p>
                    <p className="text-sm text-gray-600">2-3 hours before departure with valid ID</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              onClick={onBackToHome}
              className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = 'mailto:support@galaxy.com'}
              className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}