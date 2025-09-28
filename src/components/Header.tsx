import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Plane, User, LogOut, Home, Search, Calendar, Settings, Menu } from 'lucide-react';

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

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: AppPage) => void;
  currentPage: AppPage;
}

export function Header({ user, onLogout, onNavigate, currentPage }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (page: AppPage) => {
    setIsOpen(false);
    onNavigate(page);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const renderNavItems = () => {
    if (!user) {
      return (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigate('landing')}
            className={`w-full justify-start ${currentPage === 'landing' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600'}`}
          >
            <Home className="h-4 w-4 mr-3" />
            Home
          </Button>
          <Button 
            onClick={() => handleNavigate('login')}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Sign In
          </Button>
        </div>
      );
    }

    if (user.role === 'user') {
      return (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigate('user-dashboard')}
            className={`w-full justify-start ${currentPage === 'user-dashboard' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600'}`}
          >
            <Home className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigate('flight-search')}
            className={`w-full justify-start ${currentPage.includes('flight') || currentPage.includes('booking') || currentPage.includes('passenger') || currentPage.includes('payment') ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600'}`}
          >
            <Search className="h-4 w-4 mr-3" />
            Book Flight
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigate('my-bookings')}
            className={`w-full justify-start ${currentPage === 'my-bookings' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600'}`}
          >
            <Calendar className="h-4 w-4 mr-3" />
            My Bookings
          </Button>
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-gray-700 mb-4 px-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Welcome, {user.name}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full text-gray-600 hover:text-red-600 hover:border-red-600"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => handleNavigate('admin-dashboard')}
          className={`w-full justify-start ${currentPage === 'admin-dashboard' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600'}`}
        >
          <Settings className="h-4 w-4 mr-3" />
          Admin Panel
        </Button>
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-gray-700 mb-4 px-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">Admin: {user.name}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full text-gray-600 hover:text-red-600 hover:border-red-600"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard') : 'landing')}
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full p-2">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900">Galaxy Airlines</h1>
              <p className="text-sm text-red-600">Experience the stars with every journey</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-xl font-bold text-gray-900">Galaxy</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('landing')}
                  className={currentPage === 'landing' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button 
                  onClick={() => onNavigate('login')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Sign In
                </Button>
              </div>
            ) : user.role === 'user' ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('user-dashboard')}
                  className={currentPage === 'user-dashboard' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('flight-search')}
                  className={currentPage.includes('flight') || currentPage.includes('booking') || currentPage.includes('passenger') || currentPage.includes('payment') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Book Flight
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('my-bookings')}
                  className={currentPage === 'my-bookings' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  My Bookings
                </Button>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Welcome, {user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="text-gray-600 hover:text-red-600 hover:border-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('admin-dashboard')}
                  className={currentPage === 'admin-dashboard' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin: {user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="text-gray-600 hover:text-red-600 hover:border-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]" aria-describedby="mobile-navigation-description">
                <div className="py-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full p-2">
                      <Plane className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Galaxy Airlines</h2>
                      <p className="text-xs text-red-600" id="mobile-navigation-description">Experience the stars</p>
                    </div>
                  </div>
                  {renderNavItems()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}