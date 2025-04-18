// pages/index.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'ongoing'
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:8000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add a function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">NFT Event Ticketing</h1>
          <div className="space-x-4">
            <Link href="/createEvent" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Event
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Error: {error}</p>
            <button 
              onClick={fetchEvents} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 mb-4">No events found.</p>
            <Link href="/createEvent" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Price: {event.price} ETH</span>
                    <span>Capacity: {event.capacity}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Start: {new Date(event.startDate).toLocaleString()}</p>
                    <p>End: {new Date(event.endDate).toLocaleString()}</p>
                  </div>
                  <Link 
                    href={`/events/${event._id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}