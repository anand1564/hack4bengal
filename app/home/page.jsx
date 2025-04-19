"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock data for demonstration purposes
const mockUsername = "JohnDoe";
const mockEvents = [
  {
    eventId: 1,
    name: "JavaScript Workshop",
    description: "Learn the basics of JavaScript in this interactive workshop",
    eventType: "LIVE_SESSION",
    price: 25.99,
    capacity: 50,
    ticketsSold: 30,
    organizerAddress: "0x1234567890abcdef",
    startDate: "2025-05-01T10:00:00Z",
    endDate: "2025-05-01T14:00:00Z",
    location: {
      name: "Tech Hub",
      address: "123 Main St, San Francisco, CA",
      coordinates: {
        type: "Point",
        coordinates: [-122.4194, 37.7749]
      }
    },
    image: "/api/placeholder/400/250"
  },
  {
    eventId: 2,
    name: "Web3 Hackathon",
    description: "Build innovative blockchain applications over the weekend",
    eventType: "HACKATHON",
    price: 0,
    capacity: 100,
    ticketsSold: 85,
    organizerAddress: "0xabcdef1234567890",
    startDate: "2025-05-15T09:00:00Z",
    endDate: "2025-05-17T18:00:00Z",
    location: {
      name: "Innovation Center",
      address: "456 Tech Blvd, Austin, TX",
      coordinates: {
        type: "Point",
        coordinates: [-97.7431, 30.2672]
      }
    },
    image: "/api/placeholder/400/250"
  },
  {
    eventId: 3,
    name: "Virtual AI Conference",
    description: "Connect with AI experts and learn about the latest advancements",
    eventType: "LIVE_SESSION",
    price: 49.99,
    capacity: 500,
    ticketsSold: 320,
    organizerAddress: "0x0987654321fedcba",
    startDate: "2025-06-10T08:00:00Z",
    endDate: "2025-06-11T17:00:00Z",
    location: {
      virtualLink: "https://virtual-ai-conference.example.com"
    },
    image: "/api/placeholder/400/250"
  }
];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const router = useRouter(); 

  useEffect(() => {
     async function fetchEvents() {
      const token = localStorage.getItem('token');
       try {
         const response = await fetch('http://localhost:8000/api/events/getEvents/all',{
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`,
           },
         });
         if (!response.ok) throw new Error('Failed to fetch events');
         const data = await response.json();
         setEvents(data);
       } catch (error) {
         console.error('Error fetching events:', error);
       } finally {
         setLoading(false);
       }
     }
 
     fetchEvents();
   }, []);
   useEffect(()=>{
    const fetchHackathons = async () =>{
      try{
        const response = await fetch('http://localhost:8000/api/hackathon',{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok) setError('Failed to fetch hackathons');
        const data = await response.json();
        setHackathons(data);
    }catch(err){
      console.error('Error fetching hackathons:', err);
      setError('Failed to fetch hackathons');
    }
   }
  fetchHackathons()
},[]);

  const handleCreateEvent = () => {
    router.push('/createEvent');
  };

  const handleCreateHackathon = () => {
    router.push('/createHackathon');
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get location display
  const getLocationDisplay = (location) => {
    if (!location) return 'Location not specified';
    if (location.virtualLink) return 'Virtual Event';
    if (location.name) return location.name;
    return 'Location details available upon registration';
  };

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {mockUsername}</h1>
              <p className="text-indigo-200">Discover amazing events near you</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleCreateEvent}
                className="bg-white text-indigo-600 font-medium py-2 px-4 rounded-lg hover:bg-indigo-100 transition duration-200"
              >
                Create Event
              </button>
              <button 
                onClick={handleCreateHackathon}
                className="bg-indigo-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-900 transition duration-200"
              >
                Create Hackathon
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Event Filtering (could be expanded) */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Find Events</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Types</option>
                <option value="IN_PERSON">In Person</option>
                <option value="LIVE_SESSION">Live Session</option>
                <option value="HACKATHON">Hackathon</option>
              </select>
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="w-full md:w-40 flex items-end">
              <button 
                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Search
              </button>
            </div>
            <div className="w-full md:w-40 flex items-end">
              <button 
                className="bg-gray-100 py-2 px-6 rounded-md hover:bg-indigo-300 transition duration-200 text-indigo-600"
              onClick={(e)=>router.push('/yourEvents')}>
                Your Events
              </button>
            </div>
            <div className="w-full md:w-40 flex items-end">
              <button 
                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Your Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6">Upcoming Events</h2>
          
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
              {events.map(event => (
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
                        <span className="font-medium">
                          {formatDate(event.startDate)}
                        </span>
                      </div>
                      <div className="text-indigo-600 font-bold">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {event.availableTickets || (event.capacity - event.ticketsSold)} spots left
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200" onClick={(e)=>router.push(`events/${event.eventId}`)} >
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Hackathons Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-800">Featured Hackathons</h2>
            <button 
              onClick={handleCreateHackathon}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All →
            </button>
          </div>
          
          {/* Display hackathons or a CTA if none */}
          {hackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hackathons
                .map(event => (
                  <div 
                    key={event.eventId} 
                    className="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition duration-200"
                  >
                    <div className="w-1/3 bg-gray-200 relative">
                      <img 
                        src={event.image || "/api/placeholder/200/300"} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2">{event.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{getLocationDisplay(event.location)}</p>
                      <p className="text-gray-700 text-sm mb-3">
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-600">
                          {event.availableTickets || (event.capacity - event.ticketsSold)} spots left
                        </div>
                        <button className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 transition duration-200" onClick={(e)=>router.push(`hackathons/${event._id}`)}>
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-indigo-800 mb-3">No Hackathons Available</h3>
              <p className="text-gray-600 mb-4">Be the first to organize an exciting hackathon!</p>
              <button 
                onClick={handleCreateHackathon}
                className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Create Hackathon
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-800 text-indigo-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-white text-lg font-semibold mb-2">Event Platform</h3>
              <p className="text-sm">Discover, create, and join amazing events</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-medium mb-2">Quick Links</h4>
                <ul className="text-sm">
                  <li className="mb-1"><a href="#" className="hover:text-white">Browse Events</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-white">Create Event</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-white">My Tickets</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Support</h4>
                <ul className="text-sm">
                  <li className="mb-1"><a href="#" className="hover:text-white">Help Center</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-indigo-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Event Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventsPage;