// Types used between database and backend for easier comm

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
  duration: number;
  releaseDate: string;
  cast?: string[];
  director?: string;
  producer?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string;
  startTime: string;
  endTime: string;
  showroom: string;
  availableSeats: string[];
  childTicketPrice: number;
  adultTicketPrice: number;
  seniorTicketPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  showtimeId: string;
  userId: string;
  movieId: string;
  seats: string[];
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
  password?: string;
  address?: string;
  payment?: string;
  subscribeToPromotions?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  active: boolean;
  verificationToken?: string | null;
  verificationExpires?: Date | null;
  verifiedAt?: Date | null;
}
