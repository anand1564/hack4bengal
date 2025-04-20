"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter();
  const eventTypes = ["Live Sessions", "Workshops", "Hackathons", "Conferences"]
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayText, setDisplayText] = useState(eventTypes[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)

      // After fade out, change the text
      setTimeout(() => {
        setCurrentEventIndex((prevIndex) => (prevIndex + 1) % eventTypes.length)
        setDisplayText(eventTypes[(currentEventIndex + 1) % eventTypes.length])
        setIsAnimating(false)
      }, 500) // Half of the transition time
    }, 2000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [currentEventIndex, eventTypes])

  return (
    <section className="py-16 px-6 md:px-12 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-700">
          <span className="text-black">On chain <span className="text-indigo-600">Event Management</span></span> for{" "}
          <span
            className={`inline-block min-w-40 transition-opacity duration-1000 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            {displayText}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Purchase tickets for online sessions, in-person events, and hackathons. Get an NFT for each event that grants
          you access to exclusive chat rooms.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors text-lg" onClick={(e)=>router.push('/auth')}>
            Browse Events
          </button>
          <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-purple-50 transition-colors text-lg" onClick={(e)=>router.push('/auth')}>
            Learn More
          </button>
        </div>
      </div>
      <div className="md:w-1/2 relative">
        <div className="relative w-full h-[400px]">
          <div className="absolute inset-0 bg-indigo-600 rounded-lg transform rotate-3"></div>
          <div className="absolute inset-0 bg-white rounded-lg border-2 border-indigo-600 overflow-hidden transform -rotate-2">
            <div className="w-full h-full relative">
              <Image
                src="/images/heroImg.png"
                alt="NFT Ticket Example"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/70 to-transparent flex items-end p-6">
                <div className="bg-white/90 p-4 rounded-lg w-full">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-indigo-600">Web3 Summit</h3>
                      <p className="text-gray-700">June 15, 202X</p>
                    </div>
                    <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">#0042</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
