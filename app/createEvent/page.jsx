"use client";

import { ethers } from "ethers";
import contractAbi from "../abis/NFTEventTicketing";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    eventType: "0", // IN_PERSON
    ticketPrice: "",
    totalTickets: "",
    startDate: "",
    endDate: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
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
      
      // Create FormData object correctly
      const form = new FormData();
      form.append("name", formData.eventName);
      form.append("description", formData.description);
      form.append("eventType", "LIVE_SESSION");
      form.append("price", formData.ticketPrice);
      form.append("capacity", formData.totalTickets);
      form.append("startDate", formData.startDate);
      form.append("endDate", formData.endDate);
      form.append("organizerAddress", organizerAddress);
      
      // Make sure we have a file before appending it
      if (coverImage) {
        form.append("coverImage", coverImage);
      }

      const token = localStorage.getItem("token");
      if(!token){
        alert("Please login to create an event");
        return;
      }
      
      console.log("Form data:", Object.fromEntries(form));
      console.log("Token: ", token);

      const response = await fetch("http://localhost:8000/api/events/createEvent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form
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

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h1 className="text-white text-2xl font-bold text-center">
            Create an Event
          </h1>
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
            
            {/* Cover Image */}
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