"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function YourEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');
    const localToken = localStorage.getItem('token');
    const token = sessionToken || localToken;

    if (token) {
      if (!sessionToken && localToken) {
        const currentAddress = sessionStorage.getItem('userAddress');
        verifyAndFetchUserData(localToken, currentAddress);
      } else {
        setIsLoggedIn(true);
        fetchUserData(token);
      }
    }
  }, []);

  const verifyAndFetchUserData = async (token, currentAddress) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (!currentAddress || data.address === currentAddress) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userAddress', data.address);
          setIsLoggedIn(true);
          setUserData(data);
        } else {
          localStorage.removeItem('token');
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userAddress");
    router.push("/login");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userData?.address) return;
      try {
        const organizerAddress = userData.address.toLowerCase();
        const res = await fetch(`http://localhost:8000/api/events/getEvents/organizer/${organizerAddress}`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [userData]);

  const handleCreateEvent = () => {
    router.push("/create-event");
  };

  const getLocationDisplay = (location) => {
    return location || "Online"; // fallback
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mb-10 bg-indigo-50 min-h-screen w-full p-6">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6">Welcome {userData?.name || "User"}</h2>
<h2 className="text-2xl font-bold text-indigo-800 mb-6">Events created by you.</h2>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No events found. Why not create one?</p>
          <button
            onClick={handleCreateEvent}
            className="mt-4 bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={event.image || "/api/placeholder/400/250"}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {event.eventType.replace('_', ' ')}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{getLocationDisplay(event.location)}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="text-indigo-600 font-bold">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {event.availableTickets || (event.capacity - event.ticketsSold || 0)} spots left
                  </div>
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                    onClick={() => router.push(`tickets/${event.eventId}`)}
                  >
                    Ticket Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
