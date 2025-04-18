"use client"
import React, { useState, useEffect } from 'react';
import { useRouter,useParams } from 'next/navigation';

// Mock data for demonstration purposes
const mockHackathon = {
     eventId: 2,
     name: "Web3 Innovation Hackathon",
     description: "Join us for a weekend of innovation and collaboration where participants will build groundbreaking blockchain applications. This hackathon challenges developers, designers, and entrepreneurs to create solutions that leverage blockchain technology to solve real-world problems. Cash prizes and opportunities for venture funding await the winning teams!",
     eventType: "HACKATHON",
     price: 0,
     capacity: 100,
     ticketsSold: 85,
     organizerAddress: "0xabcdef1234567890",
     startDate: "2025-05-15T09:00:00Z",
     endDate: "2025-05-17T18:00:00Z",
     registrationDeadline: "2025-05-10T23:59:59Z",
     submissionDeadline: "2025-05-17T17:00:00Z",
     location: {
          name: "Innovation Center",
          address: "456 Tech Blvd, Austin, TX",
          coordinates: {
               type: "Point",
               coordinates: [-97.7431, 30.2672]
          },
          virtualLink: "https://virtual-platform.example.com/hackathon"
     },
     image: "/api/placeholder/800/400",
     prizes: [
          { rank: "1st", amount: "$5,000", description: "Cash prize plus mentorship opportunity" },
          { rank: "2nd", amount: "$2,500", description: "Cash prize" },
          { rank: "3rd", amount: "$1,000", description: "Cash prize" }
     ],
     judges: [
          { name: "Dr. Sarah Chen", role: "CTO at BlockTech", image: "/api/placeholder/100/100" },
          { name: "Michael Rodriguez", role: "Founder of DAppLabs", image: "/api/placeholder/100/100" },
          { name: "Aisha Johnson", role: "Blockchain Researcher", image: "/api/placeholder/100/100" }
     ],
     timeline: [
          { time: "May 15, 9:00 AM", event: "Opening Ceremony" },
          { time: "May 15, 10:00 AM", event: "Hacking Begins" },
          { time: "May 16, 2:00 PM", event: "Mid-point Check-in" },
          { time: "May 17, 4:00 PM", event: "Submissions Due" },
          { time: "May 17, 5:00 PM", event: "Presentations & Judging" },
          { time: "May 17, 6:30 PM", event: "Awards Ceremony" }
     ],
     rules: [
          "Teams of 1-4 people",
          "All code must be written during the hackathon",
          "Use of open-source libraries and APIs is permitted",
          "Submissions must include source code and a demo video",
          "Projects must be relevant to the blockchain/Web3 theme"
     ],
     resources: [
          { name: "Documentation Hub", link: "#" },
          { name: "API Resources", link: "#" },
          { name: "Mentor Support", link: "#" }
     ]
};

export default function HackathonDetailsPage(){
     const { id } = useParams(); // In a real app, you would use this to fetch the specific hackathon
     const router = useRouter();
     const [hackathon, setHackathon] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [isRegistered, setIsRegistered] = useState(false);
     const [showConfirmation, setShowConfirmation] = useState(false);

     useEffect(() => {
          // In a real application, you would fetch from your API using the id parameter
          // Example: fetchHackathonDetails(id);

          // For now, we'll use mock data with a delay to simulate API call
          const fetchData = async () => {
               try {
                    setLoading(true);
                    // Simulating API delay
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setHackathon(mockHackathon);
                    setLoading(false);
               } catch (err) {
                    setError("Failed to load hackathon details. Please try again later.");
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     // Function to format date
     const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
               weekday: 'long',
               month: 'long',
               day: 'numeric',
               year: 'numeric',
               hour: '2-digit',
               minute: '2-digit'
          });
     };

     // Function to format date without time
     const formatDateShort = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
               month: 'long',
               day: 'numeric',
               year: 'numeric'
          });
     };

     // Check if registration deadline has passed
     const isRegistrationClosed = (deadline) => {
          if (!deadline) return false;
          return new Date() > new Date(deadline);
     };

     // Check if submission period is active
     const isSubmissionOpen = (startDate, submissionDeadline) => {
          if (!startDate || !submissionDeadline) return false;
          const now = new Date();
          return now >= new Date(startDate) && now <= new Date(submissionDeadline);
     };

     // Calculate remaining time until registration deadline
     const getTimeRemaining = (deadline) => {
          if (!deadline) return { days: 0, hours: 0, minutes: 0 };

          const total = new Date(deadline) - new Date();
          if (total <= 0) return { days: 0, hours: 0, minutes: 0 };

          const days = Math.floor(total / (1000 * 60 * 60 * 24));
          const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));

          return { days, hours, minutes };
     };

     const handleRegister = () => {
          // In a real app, you would make an API call to register
          setShowConfirmation(true);
          setTimeout(() => {
               setIsRegistered(true);
               setShowConfirmation(false);
          }, 1500);
     };

     const handleSubmitProject = () => {
          // In a real app, navigate to project submission form
          navigate(`/submit-project/${id}`);
     };

     if (loading) {
          return (
               <div className="min-h-screen bg-indigo-50 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
               </div>
          );
     }

     if (error || !hackathon) {
          return (
               <div className="min-h-screen bg-indigo-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
                         <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
                         <p className="text-gray-700 mb-4">{error || "Hackathon not found"}</p>
                         <button
                              onClick={() => navigate('/events')}
                              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                         >
                              Back to Events
                         </button>
                    </div>
               </div>
          );
     }

     const remaining = getTimeRemaining(hackathon.registrationDeadline);
     const registrationClosed = isRegistrationClosed(hackathon.registrationDeadline);
     const submissionOpen = isSubmissionOpen(hackathon.startDate, hackathon.submissionDeadline);

     return (
          <div className="min-h-screen bg-indigo-50">
               {/* Confirmation Modal */}
               {showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                         <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
                              <div className="text-center">
                                   <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                   </div>
                                   <h3 className="text-lg font-medium text-gray-900 mt-4">Processing your registration</h3>
                                   <p className="text-sm text-gray-500 mt-2">Please wait while we secure your spot...</p>
                              </div>
                         </div>
                    </div>
               )}

               {/* Header with Hackathon Image */}
               <header className="relative">
                    <div className="h-64 md:h-80 w-full bg-gray-300 overflow-hidden">
                         <img
                              src={hackathon.image || "/api/placeholder/1200/400"}
                              alt={hackathon.name}
                              className="w-full h-full object-cover"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                         <div className="container mx-auto">
                              <div className="flex flex-col md:flex-row md:items-end justify-between">
                                   <div>
                                        <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                                             HACKATHON
                                        </span>
                                        <h1 className="text-3xl md:text-4xl font-bold">{hackathon.name}</h1>
                                   </div>
                                   <div className="mt-4 md:mt-0">
                                        <div className="bg-indigo-800 bg-opacity-70 rounded-lg px-4 py-2">
                                             {registrationClosed ? (
                                                  <span className="text-lg font-semibold">Registration Closed</span>
                                             ) : (
                                                  <div>
                                                       <span className="text-sm">Registration closes in:</span>
                                                       <div className="flex space-x-3 mt-1">
                                                            <div className="text-center">
                                                                 <span className="block text-xl font-bold">{remaining.days}</span>
                                                                 <span className="text-xs text-indigo-200">days</span>
                                                            </div>
                                                            <div className="text-center">
                                                                 <span className="block text-xl font-bold">{remaining.hours}</span>
                                                                 <span className="text-xs text-indigo-200">hours</span>
                                                            </div>
                                                            <div className="text-center">
                                                                 <span className="block text-xl font-bold">{remaining.minutes}</span>
                                                                 <span className="text-xs text-indigo-200">mins</span>
                                                            </div>
                                                       </div>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </header>

               {/* Navigation bar */}
               <nav className="bg-white shadow">
                    <div className="container mx-auto px-4">
                         <div className="flex overflow-x-auto whitespace-nowrap py-3 hide-scrollbar">
                              <a href="#overview" className="px-4 py-2 text-indigo-600 font-medium">Overview</a>
                              <a href="#details" className="px-4 py-2 text-gray-600 hover:text-indigo-600">Details</a>
                              <a href="#timeline" className="px-4 py-2 text-gray-600 hover:text-indigo-600">Timeline</a>
                              <a href="#prizes" className="px-4 py-2 text-gray-600 hover:text-indigo-600">Prizes</a>
                              <a href="#judges" className="px-4 py-2 text-gray-600 hover:text-indigo-600">Judges</a>
                              <a href="#rules" className="px-4 py-2 text-gray-600 hover:text-indigo-600">Rules</a>
                              <a href="#resources" className="px-4 py-2 text-gray-600 hover:text-indigo-600">Resources</a>
                         </div>
                    </div>
               </nav>

               {/* Main Content */}
               <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                         {/* Main Content */}
                         <div className="w-full lg:w-2/3">
                              {/* Overview Section */}
                              <section id="overview" className="mb-10">
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Overview</h2>
                                        <p className="text-gray-700 mb-6">{hackathon.description}</p>

                                        {/* Key Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                             <div className="flex items-start">
                                                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                       <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                       </svg>
                                                  </div>
                                                  <div>
                                                       <h3 className="font-medium text-gray-800">Dates</h3>
                                                       <p className="text-gray-600 text-sm">{formatDateShort(hackathon.startDate)} - {formatDateShort(hackathon.endDate)}</p>
                                                  </div>
                                             </div>
                                             <div className="flex items-start">
                                                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                       <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                       </svg>
                                                  </div>
                                                  <div>
                                                       <h3 className="font-medium text-gray-800">Location</h3>
                                                       <p className="text-gray-600 text-sm">{hackathon.location.name}</p>
                                                       <p className="text-gray-600 text-sm">{hackathon.location.address}</p>
                                                  </div>
                                             </div>
                                             <div className="flex items-start">
                                                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                       <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                       </svg>
                                                  </div>
                                                  <div>
                                                       <h3 className="font-medium text-gray-800">Entry Fee</h3>
                                                       <p className="text-gray-600 text-sm">{hackathon.price === 0 ? 'Free' : `$${hackathon.price}`}</p>
                                                  </div>
                                             </div>
                                             <div className="flex items-start">
                                                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                       <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                       </svg>
                                                  </div>
                                                  <div>
                                                       <h3 className="font-medium text-gray-800">Capacity</h3>
                                                       <p className="text-gray-600 text-sm">{hackathon.capacity} participants ({hackathon.capacity - hackathon.ticketsSold} spots left)</p>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Virtual Link */}
                                        {hackathon.location.virtualLink && (
                                             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                                                  <h3 className="font-medium text-indigo-800 mb-1">Virtual Access</h3>
                                                  <p className="text-gray-600 text-sm mb-2">This hackathon has both in-person and virtual components. Registered participants will receive access to:</p>
                                                  <div className="flex items-center">
                                                       <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                       </svg>
                                                       <span className="text-indigo-600 font-medium">Virtual Platform Link</span>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </section>

                              {/* Timeline Section */}
                              <section id="timeline" className="mb-10">
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Event Timeline</h2>
                                        <div className="relative">
                                             <div className="absolute left-4 h-full w-0.5 bg-indigo-200"></div>
                                             <div className="space-y-6">
                                                  {hackathon.timeline.map((item, index) => (
                                                       <div key={index} className="flex items-start">
                                                            <div className="flex-shrink-0 bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white relative z-10">
                                                                 {index + 1}
                                                            </div>
                                                            <div className="ml-4">
                                                                 <h3 className="font-medium text-gray-800">{item.event}</h3>
                                                                 <input type="text" className="" value={item.time} />
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>
                              </section>

                              {/* Prizes Section */}
                              <section id="prizes" className="mb-10">
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Prizes</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                             {hackathon.prizes.map((prize, index) => (
                                                  <div
                                                       key={index}
                                                       className={`border rounded-lg p-4 ${index === 0 ? 'bg-yellow-50 border-yellow-200' : index === 1 ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'}`}
                                                  >
                                                       <div className="flex justify-between items-start mb-2">
                                                            <span className="font-bold text-xl">{prize.rank}</span>
                                                            <span className={`text-xl font-bold ${index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : 'text-orange-600'}`}>
                                                                 {prize.amount}
                                                            </span>
                                                       </div>
                                                       <p className="text-gray-600 text-sm">{prize.description}</p>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              </section>

                              {/* Judges Section */}
                              <section id="judges" className="mb-10">
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Judges</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                             {hackathon.judges.map((judge, index) => (
                                                  <div key={index} className="flex flex-col items-center text-center">
                                                       <div className="w-20 h-20 mb-3 rounded-full overflow-hidden">
                                                            <img src={judge.image} alt={judge.name} className="w-full h-full object-cover" />
                                                       </div>
                                                       <h3 className="font-medium text-gray-800">{judge.name}</h3>
                                                       <p className="text-indigo-600 text-sm">{judge.role}</p>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              </section>

                              {/* Rules Section */}
                              <section id="rules" className="mb-10">
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Rules & Requirements</h2>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                             {hackathon.rules.map((rule, index) => (
                                                  <li key={index}>{rule}</li>
                                             ))}
                                        </ul>
                                   </div>
                              </section>

                              {/* Resources Section */}
                              <section id="resources" className="mb-10">
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Resources</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {hackathon.resources.map((resource, index) => (
                                                  <a
                                                       key={index}
                                                       href={resource.link}
                                                       className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 transition duration-200"
                                                  >
                                                       <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                       </div>
                                                       <span className="font-medium text-gray-800">{resource.name}</span>
                                                  </a>
                                             ))}
                                        </div>
                                   </div>
                              </section>
                         </div>

                         {/* Sidebar */}
                         <div className="w-full lg:w-1/3">
                              <div className="sticky top-8">
                                   {/* Registration Card */}
                                   <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                        <h2 className="text-xl font-bold text-indigo-800 mb-4">Registration</h2>

                                        {/* Registration Status */}
                                        <div className="mb-4">
                                             <div className="flex justify-between text-sm mb-1">
                                                  <span className="text-gray-600">Available spots</span>
                                                  <span className="font-medium">{hackathon.capacity - hackathon.ticketsSold} / {hackathon.capacity}</span>
                                             </div>
                                             <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                  <div
                                                       className="bg-indigo-600 h-2.5 rounded-full"
                                                       style={{ width: `${(hackathon.ticketsSold / hackathon.capacity) * 100}%` }}
                                                  ></div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
}