"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const initialHackathon = {
     eventId: null,
     name: "Your Hackathon Name",
     description: "Describe your hackathon here. What is it about? What will participants build? What problems will they solve?",
     eventType: "HACKATHON",
     price: 0,
     capacity: 100,
     ticketsSold: 0,
     organizerAddress: "",
     startDate: "",
     endDate: "",
     registrationDeadline: "",
     submissionDeadline: "",
     location: {
          name: "Venue Name",
          address: "Venue Address",
          coordinates: {
               type: "Point",
               coordinates: [0, 0]
          },
          virtualLink: ""
     },
     image: "/api/placeholder/800/400",
     prizes: [
          { rank: "1st", amount: "", description: "" },
          { rank: "2nd", amount: "", description: "" },
          { rank: "3rd", amount: "", description: "" }
     ],
     judges: [
          { name: "", role: "", image: "/api/placeholder/100/100" },
          { name: "", role: "", image: "/api/placeholder/100/100" },
          { name: "", role: "", image: "/api/placeholder/100/100" }
     ],
     timeline: [
          { time: "", event: "Opening Ceremony" },
          { time: "", event: "Hacking Begins" },
          { time: "", event: "Mid-point Check-in" },
          { time: "", event: "Submissions Due" },
          { time: "", event: "Presentations & Judging" },
          { time: "", event: "Awards Ceremony" }
     ],
     rules: [
          "Teams of 1-4 people",
          "All code must be written during the hackathon",
          "Use of open-source libraries and APIs is permitted",
          "Submissions must include source code and a demo video",
          ""
     ],
     resources: [
          { name: "", link: "" },
          { name: "", link: "" },
          { name: "", link: "" }
     ]
};

export default function HackathonDetailsPage(){
     const router = useRouter();
     const [hackathon, setHackathon] = useState(initialHackathon);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     // Function to handle input changes for basic fields
     const handleInputChange = (e) => {
          const { name, value } = e.target;
          setHackathon(prev => ({
               ...prev,
               [name]: value
          }));
     };
     const handleFileChange = (e) => {
          if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
          }
        };

     // Function to handle nested object input changes
     const handleNestedInputChange = (objectName, field, value) => {
          setHackathon(prev => ({
               ...prev,
               [objectName]: {
                    ...prev[objectName],
                    [field]: value
               }
          }));
     };

     // Function to handle location input changes
     const handleLocationChange = (field, value) => {
          setHackathon(prev => ({
               ...prev,
               location: {
                    ...prev.location,
                    [field]: value
               }
          }));
     };

     // Function to handle array item changes
     const handleArrayItemChange = (arrayName, index, field, value) => {
          setHackathon(prev => {
               const newArray = [...prev[arrayName]];
               newArray[index] = { ...newArray[index], [field]: value };
               return {
                    ...prev,
                    [arrayName]: newArray
               };
          });
     };

     // Function to handle rules changes
     const handleRuleChange = (index, value) => {
          setHackathon(prev => {
               const newRules = [...prev.rules];
               newRules[index] = value;
               return {
                    ...prev,
                    rules: newRules
               };
          });
     };

     // Function to add a new rule
     const addRule = () => {
          setHackathon(prev => ({
               ...prev,
               rules: [...prev.rules, ""]
          }));
     };

     // Function to remove a rule
     const removeRule = (index) => {
          setHackathon(prev => ({
               ...prev,
               rules: prev.rules.filter((_, i) => i !== index)
          }));
     };

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
     const handleSubmit = async (e) => {
          e.preventDefault();
     }

     return (
          <div className="min-h-screen bg-indigo-50 text-black w-full">
               <header className="bg-indigo-800 text-white p-6">
                    <div className="container mx-auto">
                         <h1 className="text-3xl font-bold">Create Your Hackathon</h1>
                         <p className="mt-2">Fill in the details below to create your hackathon. Preview your event as you build it!</p>
                    </div>
               </header>

               <main className="container mx-auto px-4 py-8">
                    <form onSubmit={handleSubmit}>
                         <div className="flex flex-col lg:flex-row gap-8">
                              {/* Main Content - Live Preview */}
                              <div className="w-full lg:w-2/3">
                                   {/* Header with Hackathon Image */}
                                   <header className="relative mb-8">
                                        <div className="h-64 md:h-80 w-full bg-gray-300 overflow-hidden rounded-lg">
                                             <input type="file" accept="image/*" onChange={(e) => handleNestedInputChange("image", e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                             <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70"></div>
                                             <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                  <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                                                       HACKATHON
                                                  </span>
                                                  <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                Add a cover image
              </label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
               
                                             </div>
                                        </div>
                                   </header>
                                   <input
                                                       type="text"
                                                       name="name"
                                                       value={hackathon.name}
                                                       onChange={handleInputChange}
                                                       placeholder="Hackathon Name"
                                                       className="text-3xl md:text-2xl font-bold bg-transparent border-b border-gray-300 w-full focus:outline-none"
                                                  />

                                   {/* Overview Section */}
                                   <section id="overview" className="mb-10">
                                        <div className="bg-white rounded-lg shadow-md p-6">
                                             <h2 className="text-2xl font-bold text-indigo-800 mb-4">Overview</h2>
                                             <textarea
                                                  name="description"
                                                  value={hackathon.description}
                                                  onChange={handleInputChange}
                                                  placeholder="Describe your hackathon here..."
                                                  className="w-full p-3 border border-gray-300 rounded mb-6 min-h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                             ></textarea>

                                             {/* Key Info */}
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                  <div className="flex items-start">
                                                       <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                       </div>
                                                       <div className="w-full">
                                                            <h3 className="font-medium text-gray-800">Dates</h3>
                                                            <div className="space-y-2 mt-1">
                                                                 <div>
                                                                      <label className="text-sm text-gray-600">Start Date</label>
                                                                      <input
                                                                           type="datetime-local"
                                                                           name="startDate"
                                                                           value={hackathon.startDate}
                                                                           onChange={handleInputChange}
                                                                           className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                      />
                                                                 </div>
                                                                 <div>
                                                                      <label className="text-sm text-gray-600">End Date</label>
                                                                      <input
                                                                           type="datetime-local"
                                                                           name="endDate"
                                                                           value={hackathon.endDate}
                                                                           onChange={handleInputChange}
                                                                           className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                      />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className="flex items-start">
                                                       <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                       </div>
                                                       <div className="w-full">
                                                            <h3 className="font-medium text-gray-800">Location</h3>
                                                            <div className="space-y-2 mt-1">
                                                                 <div>
                                                                      <label className="text-sm text-gray-600">Venue Name</label>
                                                                      <input
                                                                           type="text"
                                                                           value={hackathon.location.name}
                                                                           onChange={(e) => handleLocationChange("name", e.target.value)}
                                                                           placeholder="Venue Name"
                                                                           className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                      />
                                                                 </div>
                                                                 <div>
                                                                      <label className="text-sm text-gray-600">Address</label>
                                                                      <input
                                                                           type="text"
                                                                           value={hackathon.location.address}
                                                                           onChange={(e) => handleLocationChange("address", e.target.value)}
                                                                           placeholder="Venue Address"
                                                                           className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                      />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className="flex items-start">
                                                       <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                       </div>
                                                       <div className="w-full">
                                                            <h3 className="font-medium text-gray-800">Entry Fee</h3>
                                                            <div className="mt-1">
                                                                 <input
                                                                      type="number"
                                                                      name="price"
                                                                      value={hackathon.price}
                                                                      onChange={handleInputChange}
                                                                      min="0"
                                                                      placeholder="0 for free"
                                                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className="flex items-start">
                                                       <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                            </svg>
                                                       </div>
                                                       <div className="w-full">
                                                            <h3 className="font-medium text-gray-800">Capacity</h3>
                                                            <div className="mt-1">
                                                                 <input
                                                                      type="number"
                                                                      name="capacity"
                                                                      value={hackathon.capacity}
                                                                      onChange={handleInputChange}
                                                                      min="1"
                                                                      placeholder="Maximum number of participants"
                                                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Virtual Link */}
                                             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                                                  <h3 className="font-medium text-indigo-800 mb-1">Virtual Access</h3>
                                                  <p className="text-gray-600 text-sm mb-2">If your hackathon has virtual components, provide the link below:</p>
                                                  <div className="flex items-center">
                                                       <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                       </svg>
                                                       <input
                                                            type="url"
                                                            value={hackathon.location.virtualLink}
                                                            onChange={(e) => handleLocationChange("virtualLink", e.target.value)}
                                                            placeholder="Virtual platform link"
                                                            className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                       />
                                                  </div>
                                             </div>

                                             {/* Deadlines */}
                                             <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                                                  <h3 className="font-medium text-indigo-800 mb-1">Important Deadlines</h3>
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                       <div>
                                                            <label className="text-sm text-gray-600">Registration Deadline</label>
                                                            <input
                                                                 type="datetime-local"
                                                                 name="registrationDeadline"
                                                                 value={hackathon.registrationDeadline}
                                                                 onChange={handleInputChange}
                                                                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                       </div>
                                                       <div>
                                                            <label className="text-sm text-gray-600">Submission Deadline</label>
                                                            <input
                                                                 type="datetime-local"
                                                                 name="submissionDeadline"
                                                                 value={hackathon.submissionDeadline}
                                                                 onChange={handleInputChange}
                                                                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                       </div>
                                                  </div>
                                             </div>
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
                                                                 <div className="ml-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                      <div>
                                                                           <label className="text-sm text-gray-600">Event</label>
                                                                           <input
                                                                                type="text" 
                                                                                value={item.event}
                                                                                onChange={(e) => handleArrayItemChange("timeline", index, "event", e.target.value)}
                                                                                placeholder="Event name"
                                                                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                           />
                                                                      </div>
                                                                      <div>
                                                                           <label className="text-sm text-gray-600">Time</label>
                                                                           <input
                                                                                type="text" 
                                                                                value={item.time}
                                                                                onChange={(e) => handleArrayItemChange("timeline", index, "time", e.target.value)}
                                                                                placeholder="e.g., May 15, 9:00 AM"
                                                                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                           />
                                                                      </div>
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
                                                                 <input
                                                                      type="text"
                                                                      value={prize.amount}
                                                                      onChange={(e) => handleArrayItemChange("prizes", index, "amount", e.target.value)}
                                                                      placeholder="e.g., $5,000"
                                                                      className={`text-right p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-24 ${index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : 'text-orange-600'}`}
                                                                 />
                                                            </div>
                                                            <input
                                                                 type="text"
                                                                 value={prize.description}
                                                                 onChange={(e) => handleArrayItemChange("prizes", index, "description", e.target.value)}
                                                                 placeholder="Prize description"
                                                                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
                                                            />
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
                                                                 <img src={judge.image} alt="Judge" className="w-full h-full object-cover" />
                                                            </div>
                                                            <input
                                                                 type="text"
                                                                 value={judge.name}
                                                                 onChange={(e) => handleArrayItemChange("judges", index, "name", e.target.value)}
                                                                 placeholder="Judge Name"
                                                                 className="w-full p-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-1"
                                                            />
                                                            <input
                                                                 type="text"
                                                                 value={judge.role}
                                                                 onChange={(e) => handleArrayItemChange("judges", index, "role", e.target.value)}
                                                                 placeholder="Role / Company"
                                                                 className="w-full p-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-600"
                                                            />
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   </section>

                                   {/* Rules Section */}
                                   <section id="rules" className="mb-10">
                                        <div className="bg-white rounded-lg shadow-md p-6">
                                             <h2 className="text-2xl font-bold text-indigo-800 mb-4">Rules & Requirements</h2>
                                             <div className="space-y-3">
                                                  {hackathon.rules.map((rule, index) => (
                                                       <div key={index} className="flex items-center">
                                                            <span className="mr-2 text-indigo-600">•</span>
                                                            <input
                                                                 type="text"
                                                                 value={rule}
                                                                 onChange={(e) => handleRuleChange(index, e.target.value)}
                                                                 placeholder="Add a rule"
                                                                 className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                            <button 
                                                                 type="button"
                                                                 onClick={() => removeRule(index)}
                                                                 className="ml-2 text-red-500 hover:text-red-700"
                                                            >
                                                                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                 </svg>
                                                            </button>
                                                       </div>
                                                  ))}
                                                  <button
                                                       type="button"
                                                       onClick={addRule}
                                                       className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                                  >
                                                       <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                       </svg>
                                                       Add Rule
                                                  </button>
                                             </div>
                                        </div>
                                   </section>

                                   {/* Resources Section */}
                                   <section id="resources" className="mb-10">
                                        <div className="bg-white rounded-lg shadow-md p-6">
                                             <h2 className="text-2xl font-bold text-indigo-800 mb-4">Resources</h2>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             </div>
                                        </div>
                                   </section>

                              </div>
                         </div>
                    </form>
               </main>

     </div>
     );
}