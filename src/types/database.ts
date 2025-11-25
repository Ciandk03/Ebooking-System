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
  cast?: string[];
  director?: string;
  producer?: string;
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
  showId: string;
  userId: string;
  seats: string[]; // Array of seat numbers like ["A1", "A2", "B5"]
  childTickets: number;
  adultTickets: number;
  seniorTickets: number;
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
  subscribeToPromotions?: boolean; // Optional promotions subscription
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  active: boolean;
  verificationToken?: string | null;
  verificationExpires?: Date | null;
  verifiedAt?: Date | null;
}

export interface Theater {
  name: string;
  address: string;
  showrooms: string[];
}

export interface Showroom {
  name: string;
  seats: string[];
  shows: string[];
}

export interface Show {
  name: string;
  availableSeats: string[];
  movie: string;
  showroom: string;
  date: string;
  startTime: string;
  endTime: string;
  adultTicketPrice: number;
  childTicketPrice: number;
  seniorTicketPrice: number;
}
