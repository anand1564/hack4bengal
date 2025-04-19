'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionResult, setTransactionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const tokenId = localStorage.getItem('token');
        if(!tokenId){
          alert("Please login to view event details.");
          window.location.href = '/login';
          return;
        }
        const res = await fetch(`http://localhost:8000/api/events/getEvents/${eventId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        console.log(data);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handlePurchase = async (e) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`http://localhost:8000/api/transactions/${eventId}/buy`, {
        method: 'POST',
        body: JSON.stringify({ buyerAddress: '0xB94e821CDD6701c2fCd635F943db0e769EB482a0' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      setTransactionResult(result);
      generatePDF(result);
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add header
    doc.setFillColor(220, 53, 69); // Red color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Event Ticket', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Ticket #${data.ticket.ticketId}`, pageWidth / 2, 30, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    
    // Add QR code if available
    if (data.qrCode) {
      // Remove the data:image/png;base64, prefix
      const qrDataRaw = data.qrCode.split(',')[1];
      doc.addImage(qrDataRaw, 'PNG', pageWidth / 2 - 40, 50, 80, 80, undefined, 'FAST');
      doc.setFontSize(10);
      doc.text('Scan this QR code at the event entrance', pageWidth / 2, 140, { align: 'center' });
    }
    
    // Add event details
    doc.setFontSize(14);
    doc.text('Event Details', 20, 160);
    
    doc.setFontSize(12);
    doc.text(`Event: ${event?.name}`, 20, 170);
    doc.text(`Start: ${formatDate(event?.startDate)}`, 20, 180);
    doc.text(`End: ${formatDate(event?.endDate)}`, 20, 190);
    
    if (event?.location?.name) {
      doc.text(`Venue: ${event.location.name}`, 20, 200);
    }
    
    if (event?.location?.address) {
      const address = event.location.address;
      // Word wrap for long addresses
      const splitAddress = doc.splitTextToSize(address, pageWidth - 40);
      doc.text(splitAddress, 20, 210);
    }
    
    // Add ticket details
    doc.setFontSize(14);
    doc.text('Ticket Information', 20, 230);
    
    doc.setFontSize(12);
    doc.text(`Owner: ${data.ticket.ownerAddress.substring(0, 8)}...${data.ticket.ownerAddress.substring(34)}`, 20, 240);
    doc.text(`Issued: ${new Date(data.ticket.mintedAt).toLocaleString()}`, 20, 250);
    doc.text(`Price: $${event?.price}`, 20, 260);
    doc.text(`Transaction: ${data.transactionHash.substring(0, 12)}...`, 20, 270);
    
    // Add footer
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 280, pageWidth, 20, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This ticket is non-refundable and cannot be duplicated.', pageWidth / 2, 290, { align: 'center' });

    doc.save(`ticket_${data.ticket.ticketId}.pdf`);
  };

  const downloadTicket = () => {
    if (transactionResult) {
      generatePDF(transactionResult);
    }
  };

  // Helper for event type display
  const getEventTypeDisplay = (type) => {
    switch(type) {
      case 'IN_PERSON': return 'In-Person Event';
      case 'LIVE_SESSION': return 'Live Session';
      case 'HACKATHON': return 'Hackathon';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Event Not Found</h2>
          <p className="mt-4">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Event Hero Section */}
        <div className="relative h-72 w-full bg-red-600">
          <div className="absolute inset-0 flex items-center justify-center">
            {event.image ? (
              <img
                src={event.image}
                alt="Event cover"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <img
                src="/api/placeholder/800/400"
                alt="Event cover"
                className="w-full h-full object-cover opacity-30"
              />
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 bg-gradient-to-b from-transparent via-red-600/50 to-red-600/80">
            <div className="bg-red-600/90 px-4 py-1 rounded-full text-sm font-medium mb-2">
              {getEventTypeDisplay(event.eventType)}
            </div>
            <h1 className="text-4xl font-bold text-center mb-2 drop-shadow-lg">{event.name}</h1>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.startDate)}</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:justify-between mb-8">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Event</h2>
              <p className="text-gray-600 mb-6">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-medium text-gray-800">Date & Time</h3>
                  </div>
                  <div className="ml-7">
                    <p className="text-gray-600">Start: {formatDate(event.startDate)}</p>
                    <p className="text-gray-600">End: {formatDate(event.endDate)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-medium text-gray-800">Location</h3>
                  </div>
                  <div className="ml-7">
                    {event.eventType === 'LIVE_SESSION' && event.location?.virtualLink ? (
                      <>
                        <p className="text-gray-600 mb-1">Virtual Event</p>
                        <a href={event.location.virtualLink} className="text-red-600 hover:underline">
                          Join Event Link
                        </a>
                      </>
                    ) : (
                      event.location && (
                        <>
                          <p className="text-gray-600 font-medium">{event.location.name || "VIRTUAL"}</p>
                          <p className="text-gray-600">{event.location.address || "VIRTUAL"}</p>
                        </>
                      )
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="font-medium text-gray-800">Organizer</h3>
                  </div>
                  <p className="text-gray-600 ml-7 break-all">
                    {event.organizerAddress}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-medium text-gray-800">Availability</h3>
                  </div>
                  <div className="ml-7">
                    <p className="text-gray-600">
                      {event.ticketsSold} / {event.capacity} tickets sold
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-red-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (event.ticketsSold / event.capacity) * 100)}%` }}
                      ></div>
                    </div>
                    {event.ticketsSold >= event.capacity && (
                      <p className="text-red-600 font-medium mt-2">Sold Out</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:ml-8 mt-8 md:mt-0">
              <div className="bg-gray-50 p-6 rounded-lg w-full md:w-72 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ticket Price</h3>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Standard Entry</span>
                  <span className="text-2xl font-bold text-red-600">${event.price}</span>
                </div>
                {event.ticketsSold >= event.capacity ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gray-400 cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={(e)=>handlePurchase(e)}
                      disabled={isProcessing}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition 
                        ${isProcessing 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'}`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Purchase Now'}
                    </button>

                    <button
                      onClick={() => router.push(`/events/${eventId}/chat`)}
                      className="w-full py-3 px-4 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
                    >
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Join Chat
                      </span>
                    </button>
                  </div>
                )}
                
                <div className="mt-4 text-sm text-gray-500">
                  <p className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Blockchain secured ticket
                  </p>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure transaction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Result Section */}
          {transactionResult && (
            <div className="mt-8 bg-green-50 border border-green-100 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-green-800">Ticket Purchased Successfully!</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Ticket Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Ticket ID</p>
                      <p className="font-medium text-gray-800">#{transactionResult.ticket.ticketId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event</p>
                      <p className="font-medium text-gray-800">{event.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium text-gray-800">${event.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Purchase Date</p>
                      <p className="font-medium text-gray-800">{new Date(transactionResult.ticket.mintedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transaction Hash</p>
                      <p className="font-medium text-gray-800 break-all">{transactionResult.transactionHash}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Ticket QR Code</h3>
                  <div className="mb-4">
                    {transactionResult.qrCode && (
                      <img 
                        src={transactionResult.qrCode} 
                        alt="Ticket QR Code" 
                        className="w-48 h-48"
                      />
                    )}
                  </div>
                  <p className="text-sm text-center text-gray-500 mb-4">Scan this QR code at the event entrance</p>
                  
                  <button 
                    onClick={downloadTicket}
                    className="flex items-center justify-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-md hover:shadow-lg w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Download Ticket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}