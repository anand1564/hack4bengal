"use client"

import { useEffect, useState } from 'react';
import { Tag, Clock, ExternalLink, CheckCircle, Search, Filter, Download } from 'lucide-react';
import { usePathname } from 'next/navigation';

const TicketListingPage=({ tickets })=>{
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, forSale, attended
  
  // Format dates
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format address to readable format
  const formatAddress = (address) => {
    if (!address) return '—';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Filter tickets based on search and filter
  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      ticket.ticketId.toString().includes(searchTerm) ||
      ticket.ownerAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    if (filter === 'forSale') return matchesSearch && ticket.forSale;
    if (filter === 'attended') return matchesSearch && ticket.attended;
    
    return matchesSearch;
  });
  
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 md:p-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Event Tickets</h1>
          <p className="opacity-80">Manage and track all tickets for Event #775345</p>
          <div className="flex flex-wrap items-center mt-6 gap-4">
            <div className="bg-indigo-500/30 px-4 py-2 rounded-lg flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              <div>
                <p className="text-xs opacity-80">Total Tickets</p>
                <p className="font-medium">{tickets.length}</p>
              </div>
            </div>
            <div className="bg-indigo-500/30 px-4 py-2 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="text-xs opacity-80">Attended</p>
                <p className="font-medium">{tickets.filter(t => t.attended).length}</p>
              </div>
            </div>
            <div className="bg-indigo-500/30 px-4 py-2 rounded-lg flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <div>
                <p className="text-xs opacity-80">Last Sale</p>
                <p className="font-medium">{formatDate(tickets[0].mintedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by ticket ID or address..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Filter:</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${filter === 'forSale' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500'}`}
                onClick={() => setFilter('forSale')}
              >
                For Sale
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${filter === 'attended' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500'}`}
                onClick={() => setFilter('attended')}
              >
                Attended
              </button>
            </div>
            
            <button 
              className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-6 bg-gray-50 p-4 rounded-t-lg border border-gray-200 text-sm font-medium text-gray-500">
          <div>Ticket ID</div>
          <div>Current Owner</div>
          <div>Original Owner</div>
          <div>Minted At</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        
        {/* Tickets List */}
        <div className="border-x border-gray-200 mb-8">
          {filteredTickets.length === 0 && (
            <div className="text-center py-12 border-b border-gray-200">
              <p className="text-gray-500">No tickets match your filters</p>
            </div>
          )}
          
          {filteredTickets.map((ticket, index) => (
            <div 
              key={ticket._id} 
              className={`grid grid-cols-1 md:grid-cols-6 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50`}
            >
              {/* Mobile View */}
              <div className="block md:hidden p-4 space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Ticket ID</p>
                    <p className="font-medium">#{ticket.ticketId}</p>
                  </div>
                  <div className={`flex items-center ${ticket.attended ? 'text-green-600' : ticket.forSale ? 'text-amber-600' : 'text-indigo-600'}`}>
                    {ticket.attended ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Attended</span>
                    ) : ticket.forSale ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">For Sale</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Owned</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Current Owner</p>
                    <p className="text-sm font-mono">{formatAddress(ticket.ownerAddress)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Original Owner</p>
                    <p className="text-sm font-mono">{formatAddress(ticket.originalOwnerAddress)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Minted At</p>
                    <p className="text-sm">{formatDate(ticket.mintedAt)}</p>
                  </div>
                </div>
                
                <div className="flex pt-2 border-t border-gray-100">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mr-4">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </button>
                </div>
              </div>
              
              {/* Desktop View */}
              <div className="hidden md:flex md:items-center p-4">
                <span className="font-medium">#{ticket.ticketId}</span>
              </div>
              <div className="hidden md:flex md:items-center p-4 font-mono text-sm">
                {formatAddress(ticket.ownerAddress)}
              </div>
              <div className="hidden md:flex md:items-center p-4 font-mono text-sm">
                {formatAddress(ticket.originalOwnerAddress)}
              </div>
              <div className="hidden md:flex md:items-center p-4 text-sm">
                {formatDate(ticket.mintedAt)}
              </div>
              <div className="hidden md:flex md:items-center p-4">
                {ticket.attended ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Attended</span>
                ) : ticket.forSale ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">For Sale</span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Owned</span>
                )}
              </div>
              <div className="hidden md:flex md:items-center md:justify-end p-4">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100">2</button>
            <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage(){
     const [tickets,setTickets] = useState([]);
     const [loading,setLoading] = useState(false);
     const [error,setError] = useState(null);
     const pathname = usePathname();
     const eventId = pathname.split('/')[2]; // Extract eventId from URL
     useEffect(()=>{
          if (!eventId) return; // Ensure eventId is available
          const fetchTickets = async () => {
               try {
                    const response = await fetch(`http://localhost:8000/api/transactions/${eventId}/tickets`);
                    if (!response.ok) {
                         throw new Error('Failed to fetch tickets');
                    }
                    const data = await response.json();
                    setTickets(data.tickets);
               } catch (err) {
                    setError(err.message);
               } finally {
                    setLoading(false);
               }
          };
          fetchTickets();
     },[eventId]);


     if(loading){
          return <div className="flex justify-center items-center py-20">Loading...</div>
     }
     if(error){
          return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>
     }
     return (
          <div className="mb-10 bg-indigo-50 min-h-screen w-full p-6 text-black">
               <h2 className="text-2xl font-bold text-indigo-800 mb-6">Tickets for Event #{eventId}</h2>
               {tickets.length === 0 ? (
                    <div className="text-center py-12">
                         <p className="text-gray-600 text-lg">No tickets found.</p>
                    </div>
               ) : (
                    <TicketListingPage tickets={tickets} />
               )}
          </div>
     )
}