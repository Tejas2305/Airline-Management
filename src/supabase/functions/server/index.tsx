import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize sample flight data and admin user
async function initializeData() {
  try {
    const existingFlights = await kv.get('flights_initialized');
    if (existingFlights) return;

    // Create admin user if not exists
    try {
      const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
        email: 'admin@galaxy.com',
        password: 'admin123',
        user_metadata: { name: 'Galaxy Admin', role: 'admin' },
        email_confirm: true
      });
      console.log('Admin user created or already exists');
    } catch (error) {
      console.log('Admin user might already exist:', error);
    }

    // Create demo user if not exists
    try {
      const { data: demoUser, error: demoError } = await supabase.auth.admin.createUser({
        email: 'demo@galaxy.com',
        password: 'demo123',
        user_metadata: { name: 'Demo User', role: 'user' },
        email_confirm: true
      });
      console.log('Demo user created or already exists');
    } catch (error) {
      console.log('Demo user might already exist:', error);
    }

    const sampleFlights = [
      {
        id: 'GA001',
        flightNumber: 'GA001',
        from: 'New York',
        to: 'Los Angeles',
        fromCode: 'JFK',
        toCode: 'LAX',
        departure: '08:00',
        arrival: '11:30',
        duration: '5h 30m',
        aircraft: 'Boeing 777',
        date: '2024-01-15',
        stops: 'non-stop',
        economy: { price: 299, available: 120 },
        business: { price: 899, available: 24 },
        first: { price: 1599, available: 8 }
      },
      {
        id: 'GA002',
        flightNumber: 'GA002',
        from: 'Los Angeles',
        to: 'Miami',
        fromCode: 'LAX',
        toCode: 'MIA',
        departure: '14:15',
        arrival: '22:45',
        duration: '4h 30m',
        aircraft: 'Airbus A320',
        date: '2024-01-15',
        stops: 'non-stop',
        economy: { price: 249, available: 150 },
        business: { price: 749, available: 20 },
        first: { price: 1299, available: 6 }
      },
      {
        id: 'GA003',
        flightNumber: 'GA003',
        from: 'Chicago',
        to: 'Seattle',
        fromCode: 'ORD',
        toCode: 'SEA',
        departure: '10:30',
        arrival: '12:45',
        duration: '4h 15m',
        aircraft: 'Boeing 737',
        date: '2024-01-15',
        stops: 'non-stop',
        economy: { price: 199, available: 140 },
        business: { price: 649, available: 18 },
        first: { price: 1099, available: 4 }
      },
      {
        id: 'GA004',
        flightNumber: 'GA004',
        from: 'Boston',
        to: 'Denver',
        fromCode: 'BOS',
        toCode: 'DEN',
        departure: '16:20',
        arrival: '19:10',
        duration: '4h 50m',
        aircraft: 'Airbus A321',
        date: '2024-01-15',
        stops: 'non-stop',
        economy: { price: 279, available: 135 },
        business: { price: 799, available: 22 },
        first: { price: 1399, available: 10 }
      },
      {
        id: 'GA005',
        flightNumber: 'GA005',
        from: 'San Francisco',
        to: 'New York',
        fromCode: 'SFO',
        toCode: 'JFK',
        departure: '07:45',
        arrival: '16:30',
        duration: '5h 45m',
        aircraft: 'Boeing 787',
        date: '2024-01-15',
        stops: 'non-stop',
        economy: { price: 329, available: 160 },
        business: { price: 949, available: 28 },
        first: { price: 1699, available: 12 }
      },
      {
        id: 'GA006',
        flightNumber: 'GA006',
        from: 'Miami',
        to: 'Chicago',
        fromCode: 'MIA',
        toCode: 'ORD',
        departure: '09:15',
        arrival: '11:30',
        duration: '3h 15m',
        aircraft: 'Boeing 737',
        date: '2024-01-16',
        stops: 'non-stop',
        economy: { price: 189, available: 130 },
        business: { price: 589, available: 16 },
        first: { price: 999, available: 6 }
      }
    ];

    await kv.set('flights_data', sampleFlights);
    await kv.set('flights_initialized', true);
    console.log('Sample flights and users initialized');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Initialize data on server start
initializeData();

// Auth routes
app.post("/make-server-59e5bae9/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup request error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Flight routes
app.get("/make-server-59e5bae9/flights", async (c) => {
  try {
    const flights = await kv.get('flights_data') || [];
    return c.json({ flights });
  } catch (error) {
    console.error('Error fetching flights:', error);
    return c.json({ error: 'Failed to fetch flights' }, 500);
  }
});

// Get available routes (origins and destinations)
app.get("/make-server-59e5bae9/flights/routes", async (c) => {
  try {
    const flights = await kv.get('flights_data') || [];
    const routes: {[key: string]: string[]} = {};
    
    // Build routes map from available flights
    flights.forEach((flight: any) => {
      if (!routes[flight.from]) {
        routes[flight.from] = [];
      }
      if (!routes[flight.from].includes(flight.to)) {
        routes[flight.from].push(flight.to);
      }
    });
    
    return c.json({ routes });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return c.json({ error: 'Failed to fetch routes' }, 500);
  }
});

app.get("/make-server-59e5bae9/flights/:id", async (c) => {
  try {
    const flightId = c.req.param('id');
    const flights = await kv.get('flights_data') || [];
    const flight = flights.find((f: any) => f.id === flightId);
    
    if (!flight) {
      return c.json({ error: 'Flight not found' }, 404);
    }
    
    return c.json({ flight });
  } catch (error) {
    console.error('Error fetching flight details:', error);
    return c.json({ error: 'Failed to fetch flight details' }, 500);
  }
});

// Booking route (requires authentication)
app.post("/make-server-59e5bae9/book", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized - please login first' }, 401);
    }

    const bookingData = await c.req.json();
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const booking = {
      ...bookingData,
      bookingId,
      userId: user.id,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    // Store booking
    await kv.set(`booking_${bookingId}`, booking);
    
    // Store user's bookings
    const userBookings = await kv.get(`user_bookings_${user.id}`) || [];
    userBookings.push(bookingId);
    await kv.set(`user_bookings_${user.id}`, userBookings);

    return c.json({ booking, message: 'Booking confirmed successfully' });
  } catch (error) {
    console.error('Error processing booking:', error);
    return c.json({ error: 'Failed to process booking' }, 500);
  }
});

// Get booking details
app.get("/make-server-59e5bae9/booking/:id", async (c) => {
  try {
    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking_${bookingId}`);
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }
    
    return c.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return c.json({ error: 'Failed to fetch booking details' }, 500);
  }
});

// Search flights with filters
app.post("/make-server-59e5bae9/search-flights", async (c) => {
  try {
    const { from, to, departDate, returnDate, passengers, classType } = await c.req.json();
    const flights = await kv.get('flights_data') || [];
    
    // Filter flights based on search criteria
    let filteredFlights = flights.filter((flight: any) => {
      // Exact match for routes
      const matchesRoute = flight.from === from && flight.to === to;
      
      // Check if flight is scheduled for the requested date
      const matchesDate = flight.date === departDate;
      
      // Check availability
      const hasAvailability = flight[classType] && flight[classType].available >= (passengers.adults + passengers.children);
      
      return matchesRoute && matchesDate && hasAvailability;
    });
    
    return c.json({ flights: filteredFlights });
  } catch (error) {
    console.error('Error searching flights:', error);
    return c.json({ error: 'Failed to search flights' }, 500);
  }
});

// Get user bookings
app.get("/make-server-59e5bae9/user-bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userBookings = await kv.get(`user_bookings_${user.id}`) || [];
    const bookings = [];
    
    for (const bookingId of userBookings) {
      const booking = await kv.get(`booking_${bookingId}`);
      if (booking) {
        bookings.push(booking);
      }
    }
    
    return c.json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

// Admin routes (require admin access)
const requireAdmin = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user || user.email !== 'admin@galaxy.com') {
    return c.json({ error: 'Admin access required' }, 403);
  }
  
  await next();
};

// Add new flight (admin only)
app.post("/make-server-59e5bae9/admin/flights", requireAdmin, async (c) => {
  try {
    const flightData = await c.req.json();
    const flights = await kv.get('flights_data') || [];
    
    const newFlight = {
      ...flightData,
      id: `GA${String(flights.length + 1).padStart(3, '0')}`,
    };
    
    flights.push(newFlight);
    await kv.set('flights_data', flights);
    
    return c.json({ flight: newFlight, message: 'Flight added successfully' });
  } catch (error) {
    console.error('Error adding flight:', error);
    return c.json({ error: 'Failed to add flight' }, 500);
  }
});

// Update flight (admin only)
app.put("/make-server-59e5bae9/admin/flights/:id", requireAdmin, async (c) => {
  try {
    const flightId = c.req.param('id');
    const updateData = await c.req.json();
    const flights = await kv.get('flights_data') || [];
    
    const flightIndex = flights.findIndex((f: any) => f.id === flightId);
    if (flightIndex === -1) {
      return c.json({ error: 'Flight not found' }, 404);
    }
    
    flights[flightIndex] = { ...flights[flightIndex], ...updateData };
    await kv.set('flights_data', flights);
    
    return c.json({ flight: flights[flightIndex], message: 'Flight updated successfully' });
  } catch (error) {
    console.error('Error updating flight:', error);
    return c.json({ error: 'Failed to update flight' }, 500);
  }
});

// Get admin analytics
app.get("/make-server-59e5bae9/admin/analytics", requireAdmin, async (c) => {
  try {
    const flights = await kv.get('flights_data') || [];
    const allBookingKeys = await kv.getByPrefix('booking_');
    
    let totalRevenue = 0;
    let totalBookings = allBookingKeys.length;
    let classRevenue = { economy: 0, business: 0, first: 0 };
    
    for (const bookingKey of allBookingKeys) {
      const booking = await kv.get(bookingKey);
      if (booking) {
        totalRevenue += booking.totalPrice;
        classRevenue[booking.classType] += booking.totalPrice;
      }
    }
    
    // Flight occupancy
    const flightStats = flights.map((flight: any) => {
      const totalSeats = flight.economy.available + flight.business.available + flight.first.available + 50; // assume some are booked
      const bookedSeats = 50; // simplified
      return {
        flightNumber: flight.flightNumber,
        occupancyRate: ((bookedSeats / totalSeats) * 100).toFixed(1),
        revenue: flight.economy.price * 30 + flight.business.price * 15 + flight.first.price * 5 // estimated
      };
    });
    
    return c.json({
      totalRevenue,
      totalBookings,
      classRevenue,
      flightStats,
      averageBookingValue: totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-59e5bae9/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);