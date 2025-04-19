"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, Trophy, Users, FileCode, Award, CheckCircle, BookOpen, Link, ChevronRight } from 'lucide-react';
import { set } from 'mongoose';

const HackathonCard=({ hackathon }) =>{
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format dates
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };
  
  // Calculate time remaining for registration
  const calculateTimeRemaining = () => {
    const now = new Date();
    const deadline = new Date(hackathon.startDate);
    const timeLeft = deadline - now;
    
    if (timeLeft <= 0) return "Registration closed";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  // Calculate spots left
  const calculateSpotsLeft = () => {
    const registered = hackathon.participants ? hackathon.participants.length : 0;
    return hackathon.capacity - registered;
  };

  // Format hackathon duration
  const formatDuration = () => {
    const start = new Date(hackathon.startDate);
    const end = new Date(hackathon.endDate);
    const durationMs = end - start;
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  // Sample resources (would be part of the hackathon data in a real app)
  const resources = [
    { name: "Starter Code", link: "#", description: "GitHub repo with boilerplate code" },
    { name: "API Documentation", link: "#", description: "Documentation for available APIs" },
    { name: "Design Assets", link: "#", description: "UI kit and design resources" },
    { name: "Technical FAQs", link: "#", description: "Common questions and solutions" }
  ];

  return (
    <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Hero Section */}
      <div className="h-64 bg-indigo-600 relative">
        <img 
          src="/api/placeholder/1200/400" 
          alt={hackathon.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/40 to-indigo-900/80"></div>
        <div className="absolute bottom-8 left-8 right-8 md:left-16 md:right-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{hackathon.name}</h1>
              <p className="text-indigo-100 text-sm md:text-base max-w-2xl line-clamp-2">{hackathon.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="mx-6 md:mx-16 flex space-x-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('timeline')} 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Timeline
          </button>
          <button 
            onClick={() => setActiveTab('rules')} 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rules' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Rules & Criteria
          </button>
          <button 
            onClick={() => setActiveTab('resources')} 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resources' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resources
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Left Content (Changes based on active tab) */}
        <div className="w-full md:w-2/3 p-6 md:p-16">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium">{formatDate(hackathon.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Clock className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">{formatDuration()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Trophy className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prize Pool</p>
                    <p className="text-sm font-medium">{hackathon.prizePool.totalAmount} {hackathon.prizePool.currency}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="text-sm font-medium">{hackathon.capacity} participants</p>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Hackathon</h2>
                <p className="text-gray-600">
                  {hackathon.description}
                </p>
              </div>
              
              {/* Blockchain Details */}
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-8">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">Blockchain Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contract Address</p>
                    <p className="text-sm font-mono bg-white p-2 rounded mt-1 border border-indigo-100">
                      {hackathon.web3Integration.contractAddress?.substring(0, 18) || ""}...
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Network</p>
                    <p className="text-sm bg-white p-2 rounded mt-1 border border-indigo-100">
                      ETHEREUM
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Token Type</p>
                    <p className="text-sm bg-white p-2 rounded mt-1 border border-indigo-100">
                      ERC-721
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Event Timeline</h2>
              <div className="space-y-8">
                <div className="relative pl-8 pb-8 border-l-2 border-indigo-200">
                  <div className="absolute -left-2 top-0">
                    <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="mb-1">
                    <span className="text-xs text-indigo-600 font-semibold">REGISTRATION OPENS</span>
                  </div>
                  <h3 className="text-base font-medium">Registration Period</h3>
                  <p className="text-sm text-gray-600 mt-1">Until {formatDate(hackathon.registrationDeadline)} at {formatTime(hackathon.registrationDeadline)}</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-indigo-200">
                  <div className="absolute -left-2 top-0">
                    <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="mb-1">
                    <span className="text-xs text-indigo-600 font-semibold">EVENT STARTS</span>
                  </div>
                  <h3 className="text-base font-medium">Hackathon Kickoff</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(hackathon.startDate)} at {formatTime(hackathon.startDate)}</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-indigo-200">
                  <div className="absolute -left-2 top-0">
                    <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="mb-1">
                    <span className="text-xs text-indigo-600 font-semibold">SUBMISSIONS DUE</span>
                  </div>
                  <h3 className="text-base font-medium">Project Submission Deadline</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(hackathon.submissionDeadline)} at {formatTime(hackathon.submissionDeadline)}</p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute -left-2 top-0">
                    <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="mb-1">
                    <span className="text-xs text-indigo-600 font-semibold">EVENT ENDS</span>
                  </div>
                  <h3 className="text-base font-medium">Hackathon Closing & Awards</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(hackathon.endDate)} at {formatTime(hackathon.endDate)}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Rules Tab */}
          {/* Rules Tab */}
{activeTab === 'rules' && (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">Rules & Judging Criteria</h2>
    
    {/* Rules */}
    <div className="mb-8">
      <h3 className="text-lg font-medium text-indigo-800 mb-4">Hackathon Rules</h3>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ul className="space-y-3">
          {hackathon.Rules && hackathon.Rules.map((rule, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{rule}</span>
            </li>
          ))}
          {(!hackathon.Rules || hackathon.Rules.length === 0) && (
            <li className="text-gray-500">No rules have been specified for this hackathon.</li>
          )}
        </ul>
      </div>
    </div>
    
    {/* Judging Criteria */}
    <div>
      <h3 className="text-lg font-medium text-indigo-800 mb-4">Judging Criteria</h3>
      {hackathon.judginCriteria && hackathon.judginCriteria.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hackathon.judginCriteria.map((criterion, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{criterion.name}</h4>
                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                  {criterion.weight}%
                </span>
              </div>
              <p className="text-gray-600 text-sm">{criterion.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">No judging criteria have been specified for this hackathon.</p>
        </div>
      )}
    </div>
  </div>
)}

{/* Resources Tab */}
{activeTab === 'resources' && (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">Hackathon Resources</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hackathon.Resources && hackathon.Resources.map((resource, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-100 rounded">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{resource.name}</h3>
                {resource.description && (
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                )}
              </div>
            </div>
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 text-indigo-600 hover:text-indigo-800"
            >
              <Link className="h-5 w-5" />
            </a>
          </div>
        </div>
      ))}
      {(!hackathon.Resources || hackathon.Resources.length === 0) && (
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">No resources have been provided for this hackathon.</p>
        </div>
      )}
    </div>
    
    <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-indigo-800 mb-2">Need Help?</h3>
      <p className="text-gray-600 mb-4">Join our Discord server for technical support, team matching, and mentor office hours throughout the hackathon.</p>
      <button className="flex items-center text-indigo-700 font-medium hover:text-indigo-900">
        Join Discord Community
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  </div>
)}
        </div>
        
        {/* Right Sidebar (Registration) */}
        <div className="w-full md:w-1/3 p-6 md:p-6 md:pt-16 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
          <div className="sticky top-6">
            {/* Registration Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Registration</h3>
              
              {/* Deadline */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Registration Deadline</p>
                  <p className="font-medium">{formatDate(hackathon.registrationDeadline)}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm font-medium">
                  {calculateTimeRemaining()}
                </div>
              </div>
              
              {/* Spots */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Available Spots</p>
                  <p className="text-sm font-medium">{calculateSpotsLeft()} of {hackathon.capacity}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(1 - (calculateSpotsLeft() / hackathon.capacity)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Register Button */}
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Register Now
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-3">
                By registering, you agree to the hackathon rules and terms.
              </p>
            </div>
            
            {/* Key Dates */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Key Dates</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Registration Closes</p>
                    <p className="text-xs text-gray-500">{formatDate(hackathon.registrationDeadline)}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-indigo-600 mr-1" />
                    <span className="text-xs text-indigo-600">{calculateTimeRemaining()}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium">Event Starts</p>
                  <p className="text-xs text-gray-500">{formatDate(hackathon.startDate)}</p>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium">Submissions Due</p>
                  <p className="text-xs text-gray-500">{formatDate(hackathon.submissionDeadline)}</p>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium">Event Ends</p>
                  <p className="text-xs text-gray-500">{formatDate(hackathon.endDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function hackathon(){
     const [hackathonId, setHackathonId] = useState(null);
     const pathname = usePathname();
     const [hackathon,setHackathon] = useState({
            name: "Hackathon Name",
            startDate: "2023-10-01T00:00:00Z",
            endDate: "2023-10-05T23:59:59Z",
            registrationDeadline: "2023-09-30T23:59:59Z",
            status: "upcoming",
            description: "This is a sample hackathon description. It provides an overview of the event, including its goals, themes, and any other relevant information.",
            criteria: [
           { _id: 1, name: "Innovation", weight: 40, description: "How innovative is the solution?" },
           { _id: 2, name: "Technical Complexity", weight: 30, description: "How technically challenging is the project?" },
           { _id: 3, name: "Presentation", weight: 30, description: "How well is the project presented?" }
            ],
            rules: "1. All participants must register.\n2. Teams must consist of 1 to 4 members.\n3. Projects must be original and created during the hackathon.",
            capacity: 100,
            prizePool: { totalAmount: 5000, currency: "USD" },
            web3Integration: {
           contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
           network: "Ethereum",
           tokenType: "ERC20"
            }
     })
     useEffect(()=>{
          const fetchHackathon = async () =>{
            const segments = pathname.split("/").filter(Boolean); // removes empty strings
            const hackathonId = segments[1]; // since segments = ['hackathons', 'abc123']
            setHackathonId(hackathonId);            
               try{
               const response = await fetch(`http://localhost:8000/api/hackathon/${hackathonId}`);
               if(!response.ok){
                    throw new Error("Failed to fetch hackathon data");
               }
               const data = await response.json();
               setHackathon(data);
              }catch(err){
                console.error(err); 
              }
          }
          fetchHackathon();
     },[hackathonId])
     return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full text-black">
               <HackathonCard hackathon={hackathon} />
          </div>
     )
}