import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Plane
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

interface PaymentPageProps {
  bookingData: BookingData;
  onPaymentComplete: () => void;
  onBack: () => void;
}

export function PaymentPage({ bookingData, onPaymentComplete, onBack }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital' | 'bank'>('card');
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateCardForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (paymentMethod === 'card') {
      // Card number validation
      if (!cardData.number.replace(/\s/g, '')) {
        newErrors.number = 'Card number is required';
      } else if (cardData.number.replace(/\s/g, '').length < 16) {
        newErrors.number = 'Please enter a valid card number';
      }
      
      // Expiry validation
      if (!cardData.expiry) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
        newErrors.expiry = 'Please enter MM/YY format';
      }
      
      // CVV validation
      if (!cardData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (cardData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      
      // Name validation
      if (!cardData.name.trim()) {
        newErrors.name = 'Cardholder name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardInput = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value.replace(/\s/g, '').substring(0, 16));
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value.substring(0, 5));
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const processPayment = async () => {
    if (!validateCardForm()) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create booking record
      const bookingId = `GA${Date.now()}`;
      const bookingRecord = {
        id: bookingId,
        ...bookingData,
        paymentMethod,
        paymentStatus: 'completed',
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };

      // Ensure user is authenticated and get access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        alert('You must be logged in to complete payment.');
        setProcessing(false);
        return;
      }

      // Save booking to server (server expects /book)
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-59e5bae9/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bookingRecord),
      });

      if (response.ok) {
        onPaymentComplete();
      } else {
        throw new Error('Booking creation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getTotalPassengers = () => {
    return bookingData.searchData.passengers.adults + bookingData.searchData.passengers.children;
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
              disabled={processing}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Secure Payment</h1>
              <p className="text-sm text-gray-600">Complete your booking</p>
            </div>

            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Choose Payment Method</h2>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value: string) => setPaymentMethod(value as 'card' | 'digital' | 'bank')}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="digital" id="digital" />
                    <Label htmlFor="digital" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Digital Wallet</p>
                        <p className="text-sm text-gray-600">Apple Pay, Google Pay, PayPal</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-gray-600">Direct bank transfer</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Card Number</label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => handleCardInput('number', e.target.value)}
                        className={`h-12 ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={19}
                      />
                      {errors.number && <p className="text-sm text-red-600">{errors.number}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => handleCardInput('expiry', e.target.value)}
                        className={`h-12 ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={5}
                      />
                      {errors.expiry && <p className="text-sm text-red-600">{errors.expiry}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">CVV</label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => handleCardInput('cvv', e.target.value)}
                        className={`h-12 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-sm text-red-600">{errors.cvv}</p>}
                    </div>
                    
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                      <Input
                        type="text"
                        placeholder="Full name as on card"
                        value={cardData.name}
                        onChange={(e) => handleCardInput('name', e.target.value)}
                        className={`h-12 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Digital Wallet */}
            {paymentMethod === 'digital' && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Wallet Payment</h3>
                  <p className="text-gray-600 mb-4">You will be redirected to complete payment with your selected digital wallet.</p>
                  <div className="flex justify-center gap-4">
                    <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">Apple Pay</div>
                    <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">Google Pay</div>
                    <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">PayPal</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bank Transfer */}
            {paymentMethod === 'bank' && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Banknote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Transfer</h3>
                  <p className="text-gray-600 mb-4">You will receive bank details via email to complete the transfer within 24 hours.</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> Your booking will be confirmed once payment is received.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Notice */}
            <Card className="border-l-4 border-l-green-500 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg sticky top-32">
              <CardHeader className="bg-red-600 text-white">
                <h2 className="text-lg font-semibold">Booking Summary</h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Flight Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Outbound Flight</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{bookingData.selectedFlight.flightNumber}</p>
                    <p>{bookingData.searchData.from} → {bookingData.searchData.to}</p>
                    <p>{bookingData.selectedFlight.departure} - {bookingData.selectedFlight.arrival}</p>
                  </div>
                </div>

                {bookingData.returnFlight && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-red-600 rotate-180" />
                      <span className="font-medium">Return Flight</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{bookingData.returnFlight.flightNumber}</p>
                      <p>{bookingData.searchData.to} → {bookingData.searchData.from}</p>
                      <p>{bookingData.returnFlight.departure} - {bookingData.returnFlight.arrival}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Passengers */}
                <div>
                  <p className="font-medium mb-2">Passengers ({getTotalPassengers()})</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    {bookingData.passengers.map((passenger, index) => (
                      <p key={index}>{passenger.name}</p>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Flight(s)</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-red-600">${bookingData.totalPrice}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <Button 
                  onClick={processPayment}
                  disabled={processing}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold mt-6"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay ${bookingData.totalPrice}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  By completing payment, you agree to the terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}