"use client";

import { ethers } from "ethers";
import contractAbi from "../abis/NFTEventTicketing";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const contractAddress = "0x364837Bfe8D9d36150801A71E187E5b96B3ADC7C";

export default function CreateEvent() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    eventType: "0", // IN_PERSON
    ticketPrice: "",
    totalTickets: "",
    startDate: "",
    endDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Handle wallet connection changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', () => setWalletAddress(''));

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', () => setWalletAddress(''));
      };
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setWalletAddress('');
    } else {
      setWalletAddress(accounts[0]);
    }
  };

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getContract = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed!");
      return null;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum); // ethers v6
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);

    return { contract, signer };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { contract, signer } = await getContract();
      if (!contract || !signer) {
        setIsSubmitting(false);
        return;
      }

      const tx = await contract.createEvent(
        formData.eventName,
        parseInt(formData.eventType),
        ethers.parseEther(formData.ticketPrice),
        parseInt(formData.totalTickets)
      );
      await tx.wait();

      const organizerAddress = await signer.getAddress();

      const response = await fetch("http://localhost:8000/api/events/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.eventName,
          description: formData.description,
          eventType: "LIVE_SESSION",
          price: formData.ticketPrice,
          capacity: formData.totalTickets,
          startDate: formData.startDate,
          endDate: formData.endDate,
          organizerAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving event details:", errorData);
        throw new Error("Failed to save event details to database");
      }

      alert("Event created successfully!");
      router.push("/home");
    } catch (err) {
      console.error("Error creating event:", err);
      alert(`Failed to create event: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 p-4">
            <h1 className="text-white text-2xl font-bold text-center">
              Create an Event
            </h1>
          </div>
          <div className="p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Connect Your Wallet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Please connect your wallet to create an event. This is required to interact with the blockchain.
            </p>
            <div className="mt-6">
              <button
                onClick={connectWallet}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h1 className="text-white text-2xl font-bold text-center">
            Create an Event
          </h1>
        </div>

        {/* Wallet info */}
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Connected Wallet:</span>
            <span className="text-sm font-mono bg-gray-100 text-black px-3 py-1 rounded-md">
              {formatAddress(walletAddress)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-black">
          <div className="space-y-4">
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                Event Name *
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Event Type */}
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                Event Type *
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="0">In Person</option>
                <option value="1">Virtual</option>
                <option value="2">Hybrid</option>
              </select>
            </div>

            {/* Ticket Price */}
            <div>
              <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">
                Ticket Price (ETH) *
              </label>
              <input
                type="number"
                id="ticketPrice"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                required
                step="0.001"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Total Tickets */}
            <div>
              <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700">
                Total Tickets *
              </label>
              <input
                type="number"
                id="totalTickets"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date and Time *
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date and Time *
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}