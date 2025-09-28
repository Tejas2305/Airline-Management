import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Plane, Star, ArrowLeft, Shield, User } from 'lucide-react';

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

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  onBack: () => void;
}

export function LoginPage({ onLogin, onSignup, onBack }: LoginPageProps) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onLogin(loginData.email, loginData.password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSignup(signupData.email, signupData.password, signupData.name);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email: string, password: string) => {
    setLoginData({ email, password });
    setLoading(true);
    setError('');
    (async () => {
      try {
        await onLogin(email, password);
      } catch (err: any) {
        setError(err.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full p-3">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Galaxy Airlines</h1>
                <p className="text-red-600">Experience the stars with every journey</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Star className="h-5 w-5 text-red-600" />
                <span>Premium comfort and luxury service</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Star className="h-5 w-5 text-red-600" />
                <span>200+ worldwide destinations</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Star className="h-5 w-5 text-red-600" />
                <span>Award-winning customer experience</span>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid sm:grid-cols-2 gap-4 pt-8">
              <Card className="border-red-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickLogin('demo@galaxy.com', 'demo123')}>
                <CardContent className="p-4 text-center">
                  <div className="bg-red-100 rounded-full p-2 w-12 h-12 mx-auto mb-3">
                    <User className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Demo User</h3>
                  <p className="text-sm text-gray-600 mb-2">Try user features</p>
                  <Badge className="bg-red-100 text-red-700">demo@galaxy.com</Badge>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickLogin('admin@galaxy.com', 'admin123')}>
                <CardContent className="p-4 text-center">
                  <div className="bg-red-100 rounded-full p-2 w-12 h-12 mx-auto mb-3">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Admin Access</h3>
                  <p className="text-sm text-gray-600 mb-2">Manage flights</p>
                  <Badge className="bg-red-100 text-red-700">admin@galaxy.com</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Aboard</h2>
            <p className="text-gray-600">Sign in to your Galaxy Airlines account</p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-red-50">
                <TabsTrigger value="login" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Signup Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                      className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Quick Access:</p>
              <div className="space-y-1">
                <p>👤 User Demo: demo@galaxy.com | demo123</p>
                <p>🛡️ Admin Demo: admin@galaxy.com | admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}