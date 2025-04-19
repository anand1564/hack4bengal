import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="py-16 px-6 md:px-12 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-700">
          <span className="text-indigo-600">NFT Tickets</span> for Exclusive Events
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Purchase tickets for online sessions, in-person events, and hackathons. Get an NFT for each event that grants
          you access to exclusive chat rooms.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors text-lg">
            Browse Events
          </button>
          <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-purple-50 transition-colors text-lg">
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
                src="/placeholder.svg?height=400&width=600"
                alt="NFT Ticket Example"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/70 to-transparent flex items-end p-6">
                <div className="bg-white/90 p-4 rounded-lg w-full">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-indigo-600">Web3 Summit</h3>
                      <p className="text-gray-700">June 15, 2023</p>
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
