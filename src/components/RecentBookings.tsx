import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BookingCard from "./BookingCard";
import {Booking, Movie, Showtime} from "../types/database";
import { keygen } from "framer-motion/client";

interface BookingRecord {
  key: number;
  movieTitle: string;
  showDate: string;
  price: number;
}
interface BookingResponse {
  success: boolean;
  data: Booking[];
  count: number;
}
interface ShowResponse {
  success: boolean;
  data: Showtime;
}
interface MovieResponse {
  success: boolean;
  data: Movie;
}

interface MovieRecord {
  title: string;
}

interface ShowRecord {
  date: string;
  startTime: string;
}
interface RecentBookingsProps {
  userId: string;
}

export default function RecentBookings({ userId }: RecentBookingsProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const bookingsRes = await fetch(`/api/bookings?userId=${userId}`);
        const json = await bookingsRes.json() as BookingResponse;
        const bookingsData = json.data;
        var key = 0;

        const enriched = await Promise.all(
          bookingsData.map(async (b: Booking) => {
            const movieRes = await fetch(`/api/movies/${b.movieId}`);
            const movieJson = await movieRes.json() as MovieResponse;
            const movieData: MovieRecord = movieJson.data;
            const cardKey = key;
            key += 1;

            const showRes = await fetch(`/api/showtimes/${b.showtimeId}`);
            const showJson = await showRes.json() as ShowResponse;
            const showData: ShowRecord = showJson.data;

            const formattedDate = new Date(showData.date + " " + showData.startTime).toLocaleString();

            return {
              key: cardKey,
              movieTitle: movieData.title,
              showDate: formattedDate,
              price: b.totalPrice,
            };
          })
        );

        setBookings(enriched);
      } catch (err) {
        console.error("Failed loading recent bookings", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading recent bookings...</div>;
  }

  return (
    <div className="h-64 overflow-y-auto pr-2 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        {bookings.map((b) => (
          <BookingCard
            key={b.key}
            movieTitle={b.movieTitle}
            showDate={b.showDate}
            price={b.price}
          />
        ))}
      </motion.div>
    </div>
  );
}
