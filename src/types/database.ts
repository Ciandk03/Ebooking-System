// Database model interfaces for the ebooking system

export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  details: string;
  trailer: string;
  genres: string[];
  currentlyRunning: boolean;
  comingSoon: boolean;
  duration: number; // in minutes
  releaseDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  theater: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  seats: string[]; // Array of seat numbers like ["A1", "A2", "B5"]
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCard {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingAddress?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password?: string; // Encrypted password
  address?: string; // Optional address as string
  payment?: string; // Optional encrypted payment card info (JSON string)
  createdAt: Date;
  updatedAt: Date;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  totalSeats: number;
  seatLayout: {
    rows: number;
    seatsPerRow: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
