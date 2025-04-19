
"use client";
import React, { useState } from 'react';
import { Calendar, Users, Trophy, Wallet, Book, Link, Award, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function CreateHackathon() {
     const router = useRouter();
  const [hackathon, setHackathon] = useState({
    name: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    eventTimeline: {
      openingCeremony: '',
      HackingBegins: '',
      SubmissionDeadline: '',
      Results: ''
    },
    organizerAddress: '',
    capacity: 0,
    prizePool: {
      totalAmount: '',
      currency: 'ETH',
      firstPrize: '0',
      secondPrize: '0',
      thirdPrize: '0'
    },
    Rules: [''],
    Resources: [{ name: '', link: '' }],
    judgingCriteria: [{ description: '', weight: 0 }]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHackathon(prev => ({ ...prev, [name]: value }));
  };

  const handleTimelineChange = (e) => {
    const { name, value } = e.target;
    setHackathon(prev => ({
      ...prev,
      eventTimeline: { ...prev.eventTimeline, [name]: value }
    }));
  };

  const handlePrizePoolChange = (e) => {
    const { name, value } = e.target;
    setHackathon(prev => ({
      ...prev,
      prizePool: { ...prev.prizePool, [name]: value }
    }));
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setHackathon(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addRule = () => {
    setHackathon(prev => ({
      ...prev,
      Rules: [...prev.Rules, '']
    }));
  };

  const removeRule = (index) => {
    setHackathon(prev => ({
      ...prev,
      Rules: prev.Rules.filter((_, i) => i !== index)
    }));
  };

  const handleRuleChange = (index, value) => {
    setHackathon(prev => ({
      ...prev,
      Rules: prev.Rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const addResource = () => {
    setHackathon(prev => ({
      ...prev,
      Resources: [...prev.Resources, { name: '', link: '' }]
    }));
  };

  const removeResource = (index) => {
    setHackathon(prev => ({
      ...prev,
      Resources: prev.Resources.filter((_, i) => i !== index)
    }));
  };

  const handleResourceChange = (index, field, value) => {
    setHackathon(prev => ({
      ...prev,
      Resources: prev.Resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const addCriteria = () => {
    setHackathon(prev => ({
      ...prev,
      judgingCriteria: [...prev.judgingCriteria, { description: '', weight: 0 }]
    }));
  };

  const removeCriteria = (index) => {
    setHackathon(prev => ({
      ...prev,
      judgingCriteria: prev.judgingCriteria.filter((_, i) => i !== index)
    }));
  };

  const handleCriteriaChange = (index, field, value) => {
    setHackathon(prev => ({
      ...prev,
      judgingCriteria: prev.judgingCriteria.map((criteria, i) => 
        i === index ? { ...criteria, [field]: value } : criteria
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
     const response = await fetch('http://localhost:8000/api/hackathon/create',{
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(hackathon)
     });
     if(!response.ok){
          alert('Error creating hackathon');
     }
     const data = await response.json();
     console.log(data);
     alert('Hackathon created successfully');
     router.push(`/hackathons/${data.hackathon._id}`);
    }catch(err){
     console.error(err);
     alert('Error creating hackathon');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 text-black w-full">
      <header className="bg-indigo-800 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Create Your Hackathon</h1>
          <p className="mt-2">Fill in the details below to create your hackathon.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hackathon Name</label>
                <input
                  type="text"
                  name="name"
                  value={hackathon.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={hackathon.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
              <Calendar className="mr-2" /> Event Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={hackathon.startDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={hackathon.endDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Opening Ceremony</label>
                <input
                  type="datetime-local"
                  name="openingCeremony"
                  value={hackathon.eventTimeline.openingCeremony}
                  onChange={handleTimelineChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hacking Begins</label>
                <input
                  type="datetime-local"
                  name="HackingBegins"
                  value={hackathon.eventTimeline.HackingBegins}
                  onChange={handleTimelineChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Submission Deadline</label>
                <input
                  type="datetime-local"
                  name="SubmissionDeadline"
                  value={hackathon.eventTimeline.SubmissionDeadline}
                  onChange={handleTimelineChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Results Announcement</label>
                <input
                  type="datetime-local"
                  name="Results"
                  value={hackathon.eventTimeline.Results}
                  onChange={handleTimelineChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
              <Users className="mr-2" /> Organization Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Organizer Address</label>
                <input
                  type="text"
                  name="organizerAddress"
                  value={hackathon.organizerAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={hackathon.capacity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Prize Pool */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
              <Trophy className="mr-2" /> Prize Pool
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="text"
                  name="totalAmount"
                  value={hackathon.prizePool.totalAmount}
                  onChange={handlePrizePoolChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={hackathon.prizePool.currency}
                  onChange={handlePrizePoolChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="ETH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Prize</label>
                <input
                  type="text"
                  name="firstPrize"
                  value={hackathon.prizePool.firstPrize}
                  onChange={handlePrizePoolChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Second Prize</label>
                <input
                  type="text"
                  name="secondPrize"
                  value={hackathon.prizePool.secondPrize}
                  onChange={handlePrizePoolChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Third Prize</label>
                <input
                  type="text"
                  name="thirdPrize"
                  value={hackathon.prizePool.thirdPrize}
                  onChange={handlePrizePoolChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          {/* Web3 Integration */}
          {/* <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
              <Wallet className="mr-2" /> Web3 Integration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contract Address</label>
                <input
                  type="text"
                  name="contractAddress"
                  value={hackathon.web3Integration.contractAddress}
                  onChange={handleWeb3Change}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Network</label>
                <input
                  type="text"
                  name="network"
                  value={hackathon.web3Integration.network}
                  onChange={handleWeb3Change}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event ID</label>
                <input
                  type="text"
                  name="eventId"
                  value={hackathon.web3Integration.eventId}
                  onChange={handleWeb3Change}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Token Type</label>
                <select
                  name="tokenType"
                  value={hackathon.web3Integration.tokenType}
                  onChange={handleWeb3Change}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="ERC721">ERC721</option>
                  <option value="ERC20">ERC20</option>
                  <option value="ERC1155">ERC1155</option>
                </select>
              </div>
            </div>
          </div> */}

          {/* Rules */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-800 flex items-center">
                <Book className="mr-2" /> Rules
              </h2>
              <button
                type="button"
                onClick={addRule}
                className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200"
              >
                <Plus size={20} />
              </button>
            </div>
            {hackathon.Rules.map((rule, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter rule"
                />
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200"
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-800 flex items-center">
                <Link className="mr-2" /> Resources
              </h2>
              <button
                type="button"
                onClick={addResource}
                className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200"
              >
                <Plus size={20} />
              </button>
            </div>
            {hackathon.Resources.map((resource, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={resource.name}
                  onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Resource name"
                />
                <input
                  type="text"
                  value={resource.link}
                  onChange={(e) => handleResourceChange(index, 'link', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Resource link"
                />
                <button
                  type="button"
                  onClick={() => removeResource(index)}
                  className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200"
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Judging Criteria */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-800 flex items-center">
                <Award className="mr-2" /> Judging Criteria
              </h2>
              <button
                type="button"
                onClick={addCriteria}
                className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200"
              >
                <Plus size={20} />
              </button>
            </div>
            {hackathon.judgingCriteria.map((criteria, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={criteria.description}
                  onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Criteria description"
                />
                <input
                  type="number"
                  value={criteria.weight}
                  onChange={(e) => handleCriteriaChange(index, 'weight', parseInt(e.target.value))}
                  className="w-24 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Weight"
                />
                <button
                  type="button"
                  onClick={() => removeCriteria(index)}
                  className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200"
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Hackathon
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
