import { db } from '../../lib/firebase';
import { Movie, Showtime, Booking, User, Theater } from '../types/database';

// Firebase Firestore
import * as firestore from 'firebase/firestore';

// Helpers
const toDate = (ts?: firestore.Timestamp) => ts?.toDate() || new Date();

function mapDoc<T>(doc: firestore.QueryDocumentSnapshot | firestore.DocumentSnapshot): T {
  const data = doc.data() as any;
  return {
    id: doc.id,
    ...data,
    createdAt: toDate(data?.createdAt),
    updatedAt: toDate(data?.updatedAt),
  } as T;
}

// Movies
export const moviesCollection = firestore.collection(db, 'movies');

export const movieService = {
  async getAllMovies(): Promise<Movie[]> {
    console.log('Fetching all movies...');
    try {
      const snapshot = await firestore.getDocs(moviesCollection);
      return snapshot.docs.map(mapDoc<Movie>);
    } catch (error) {
      throw new Error(`getAllMovies failed: ${error}`);
    }
  },

  async getMovieById(id: string): Promise<Movie | null> {
    console.log(`Fetching movie ID: ${id}`);
    try {
      const docRef = firestore.doc(moviesCollection, id);
      const docSnap = await firestore.getDoc(docRef);
      return docSnap.exists() ? mapDoc<Movie>(docSnap) : null;
    } catch (error) {
      throw new Error(`getMovieById failed: ${error}`);
    }
  },

  async createMovie(movieData: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log(`Creating movie: ${movieData.title}`);
    try {
      const now = firestore.Timestamp.fromDate(new Date());
      const docRef = await firestore.addDoc(moviesCollection, {
        ...movieData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`createMovie failed: ${error}`);
    }
  },

  async updateMovie(id: string, movieData: Partial<Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    console.log(`Updating movie ID: ${id}`);
    try {
      const docRef = firestore.doc(moviesCollection, id);
      await firestore.updateDoc(docRef, {
        ...movieData,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error(`updateMovie failed: ${error}`);
    }
  },

  async deleteMovie(id: string): Promise<void> {
    console.log(`Deleting movie ID: ${id}`);
    try {
      const docRef = firestore.doc(moviesCollection, id);
      await firestore.deleteDoc(docRef);
    } catch (error) {
      throw new Error(`deleteMovie failed: ${error}`);
    }
  },
};

// Showtimes
export const showtimesCollection = firestore.collection(db, 'showtimes');

export const showtimeService = {
  async getAllShowtimes(): Promise<Showtime[]> {
    console.log('Fetching all showtimes...');
    try {
      const snapshot = await firestore.getDocs(showtimesCollection);
      return snapshot.docs.map(mapDoc<Showtime>);
    } catch (error) {
      throw new Error(`getAllShowtimes failed: ${error}`);
    }
  },

  async getShowtimesByMovieId(movieId: string): Promise<Showtime[]> {
    console.log(`Fetching showtimes for movie ID: ${movieId}`);
    try {
      const q = firestore.query(showtimesCollection, firestore.where('movieId', '==', movieId));
      const snapshot = await firestore.getDocs(q);
      return snapshot.docs.map(mapDoc<Showtime>);
    } catch (error) {
      throw new Error(`getShowtimesByMovieId failed: ${error}`);
    }
  },

  async createShowtime(showtimeData: Omit<Showtime, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log(`Creating showtime for movie: ${showtimeData.movieId}`);
    try {
      const now = firestore.Timestamp.fromDate(new Date());
      const docRef = await firestore.addDoc(showtimesCollection, {
        ...showtimeData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`createShowtime failed: ${error}`);
    }
  },

  async updateShowtime(id: string, showtimeData: Partial<Omit<Showtime, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    console.log(`Updating showtime ID: ${id}`);
    try {
      const docRef = firestore.doc(showtimesCollection, id);
      await firestore.updateDoc(docRef, {
        ...showtimeData,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error(`updateShowtime failed: ${error}`);
    }
  },

  async deleteShowtime(id: string): Promise<void> {
    console.log(`Deleting showtime ID: ${id}`);
    try {
      const docRef = firestore.doc(showtimesCollection, id);
      await firestore.deleteDoc(docRef);
    } catch (error) {
      throw new Error(`deleteShowtime failed: ${error}`);
    }
  },
};

// Bookings
export const bookingsCollection = firestore.collection(db, 'bookings');

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    console.log('Fetching all bookings...');
    try {
      const snapshot = await firestore.getDocs(bookingsCollection);
      return snapshot.docs.map((doc: any) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          bookingDate: toDate(data?.bookingDate),
          createdAt: toDate(data?.createdAt),
          updatedAt: toDate(data?.updatedAt),
        } as Booking;
      });
    } catch (error) {
      throw new Error(`getAllBookings failed: ${error}`);
    }
  },

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    console.log(`Fetching bookings for user ID: ${userId}`);
    try {
      const q = firestore.query(bookingsCollection, firestore.where('userId', '==', userId));
      const snapshot = await firestore.getDocs(q);
      return snapshot.docs.map((doc: any) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          bookingDate: toDate(data?.bookingDate),
          createdAt: toDate(data?.createdAt),
          updatedAt: toDate(data?.updatedAt),
        } as Booking;
      });
    } catch (error) {
      throw new Error(`getBookingsByUserId failed: ${error}`);
    }
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log(`Creating booking for user: ${bookingData.userId}`);
    try {
      const now = firestore.Timestamp.fromDate(new Date());
      const docRef = await firestore.addDoc(bookingsCollection, {
        ...bookingData,
        bookingDate: firestore.Timestamp.fromDate(bookingData.bookingDate),
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`createBooking failed: ${error}`);
    }
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    console.log(`Updating booking status ID: ${id} to ${status}`);
    try {
      const docRef = firestore.doc(bookingsCollection, id);
      await firestore.updateDoc(docRef, {
        status,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error(`updateBookingStatus failed: ${error}`);
    }
  },

  async deleteBooking(id: string): Promise<void> {
    console.log(`Deleting booking ID: ${id}`);
    try {
      const docRef = firestore.doc(bookingsCollection, id);
      await firestore.deleteDoc(docRef);
    } catch (error) {
      throw new Error(`deleteBooking failed: ${error}`);
    }
  },
};

// Users
export const usersCollection = firestore.collection(db, 'users');

export const userService = {
  async getAllUsers(): Promise<User[]> {
    console.log('Fetching all users...');
    try {
      const snapshot = await firestore.getDocs(usersCollection);
      return snapshot.docs.map(mapDoc<User>);
    } catch (error) {
      throw new Error(`getAllUsers failed: ${error}`);
    }
  },

  async getUserById(id: string): Promise<User | null> {
    console.log(`Fetching user ID: ${id}`);
    try {
      const docRef = firestore.doc(usersCollection, id);
      const docSnap = await firestore.getDoc(docRef);
      return docSnap.exists() ? mapDoc<User>(docSnap) : null;
    } catch (error) {
      throw new Error(`getUserById failed: ${error}`);
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    console.log(`Fetching user by email: ${email}`);
    try {
      const q = firestore.query(usersCollection, firestore.where('email', '==', email));
      const snapshot = await firestore.getDocs(q);
      if (snapshot.empty) return null;
      return mapDoc<User>(snapshot.docs[0]);
    } catch (error) {
      throw new Error(`getUserByEmail failed: ${error}`);
    }
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log(`Creating user: ${userData.email}`);
    try {
      const now = firestore.Timestamp.fromDate(new Date());
      const docRef = await firestore.addDoc(usersCollection, {
        ...userData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`createUser failed: ${error}`);
    }
  },

  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    console.log(`Updating user ID: ${id}`);
    try {
      const docRef = firestore.doc(usersCollection, id);
      await firestore.updateDoc(docRef, {
        ...userData,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error(`updateUser failed: ${error}`);
    }
  },

  async deleteUser(id: string): Promise<void> {
    console.log(`Deleting user ID: ${id}`);
    try {
      const docRef = firestore.doc(usersCollection, id);
      await firestore.deleteDoc(docRef);
    } catch (error) {
      throw new Error(`deleteUser failed: ${error}`);
    }
  },
};

