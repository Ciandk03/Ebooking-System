'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      console.log('Testing database connection...');
      const response = await fetch('/api/test');
      const data = await response.json();
      console.log('Test results:', data);
      setResults(data);
    } catch (error) {
      console.error('Test failed:', error);
      setResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const createSampleMovie = async () => {
    setLoading(true);
    try {
      console.log('Creating sample movie...');
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create-sample-movie' }),
      });
      const data = await response.json();
      console.log('Sample movie result:', data);
      setResults(data);
    } catch (error) {
      console.error('Failed to create sample movie:', error);
      setResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testMoviesApi = async () => {
    setLoading(true);
    try {
      console.log('Testing movies API...');
      const response = await fetch('/api/movies');
      const data = await response.json();
      console.log('Movies API result:', data);
      setResults(data);
    } catch (error) {
      console.error('Movies API test failed:', error);
      setResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testShowtimesApi = async () => {
    setLoading(true);
    try {
      console.log('Testing showtimes API...');
      const response = await fetch('/api/showtimes');
      const data = await response.json();
      console.log('Showtimes API result:', data);
      setResults(data);
    } catch (error) {
      console.error('Showtimes API test failed:', error);
      setResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testBookingsApi = async () => {
    setLoading(true);
    try {
      console.log('Testing bookings API...');
      const response = await fetch('/api/bookings');
      const data = await response.json();
      console.log('Bookings API result:', data);
      setResults(data);
    } catch (error) {
      console.error('Bookings API test failed:', error);
      setResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 API Test Dashboard
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database Connection Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? 'Testing...' : 'Test Database Connection'}
            </button>
            
            <button
              onClick={createSampleMovie}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? 'Creating...' : 'Create Sample Movie'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testMoviesApi}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? 'Testing...' : 'Test Movies API'}
            </button>
            
            <button
              onClick={testShowtimesApi}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? 'Testing...' : 'Test Showtimes API'}
            </button>
            
            <button
              onClick={testBookingsApi}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? 'Testing...' : 'Test Bookings API'}
            </button>
          </div>
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Available API Endpoints</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <div><strong>GET /api/movies</strong> - Fetch all movies</div>
            <div><strong>POST /api/movies</strong> - Create a new movie</div>
            <div><strong>GET /api/movies/[id]</strong> - Get movie by ID</div>
            <div><strong>PUT /api/movies/[id]</strong> - Update movie</div>
            <div><strong>DELETE /api/movies/[id]</strong> - Delete movie</div>
            <div><strong>GET /api/showtimes</strong> - Fetch all showtimes (supports ?movieId=xxx filter)</div>
            <div><strong>POST /api/showtimes</strong> - Create a new showtime</div>
            <div><strong>GET /api/bookings</strong> - Fetch all bookings (supports ?userId=xxx filter)</div>
            <div><strong>POST /api/bookings</strong> - Create a new booking</div>
            <div><strong>PUT /api/bookings/[id]</strong> - Update booking status</div>
            <div><strong>GET /api/test</strong> - Test database connection</div>
            <div><strong>POST /api/test</strong> - Create sample data</div>
          </div>
        </div>
      </div>
    </div>
  );
}
