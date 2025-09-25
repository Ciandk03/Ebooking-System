'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    movieTitle: '',
    showtime: '',
    seats: '',
    customerName: '',
    email: '',
    phone: ''
  });

  // Pre-fill form with URL parameters
  useEffect(() => {
    const movieId = searchParams.get('movieId');
    const title = searchParams.get('title');
    const showtime = searchParams.get('showtime');

    if (title) {
      setFormData(prev => ({ ...prev, movieTitle: title }));
    }
    if (showtime) {
      setFormData(prev => ({ ...prev, showtime: showtime }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking form submitted:', formData);
    alert('Booking submitted! (This is a demo)');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🎬 Movie Booking
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Movie Title
              </label>
              <input
                type="text"
                id="movieTitle"
                name="movieTitle"
                value={formData.movieTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter movie title"
                required
              />
            </div>

            <div>
              <label htmlFor="showtime" className="block text-sm font-medium text-gray-700 mb-2">
                Showtime
              </label>
              <select
                id="showtime"
                name="showtime"
                value={formData.showtime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select showtime</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="10:00 PM">10:00 PM</option>
              </select>
            </div>

            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Seats
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of seats"
                min="1"
                max="10"
                required
              />
            </div>

            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Confirm Booking
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Booking Summary</h3>
          <div className="text-sm text-blue-800">
            <p><strong>Movie:</strong> {formData.movieTitle || 'Not selected'}</p>
            <p><strong>Showtime:</strong> {formData.showtime || 'Not selected'}</p>
            <p><strong>Seats:</strong> {formData.seats || 'Not specified'}</p>
            <p><strong>Customer:</strong> {formData.customerName || 'Not provided'}</p>
            <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
            <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}