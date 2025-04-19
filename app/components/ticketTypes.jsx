import { Calendar, Users, Code } from "lucide-react"

const tickets = [
  {
    title: "Online Sessions",
    description: "Join virtual events and workshops from anywhere in the world",
    icon: Calendar,
    color: "bg-purple-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "In-Person Events",
    description: "Experience the energy of live events with fellow enthusiasts",
    icon: Users,
    color: "bg-purple-200",
    iconColor: "text-indigo-600",
  },
  {
    title: "Hackathons",
    description: "Collaborate, compete, and create in intensive coding events",
    icon: Code,
    color: "bg-purple-300",
    iconColor: "text-indigo-600",
  },
]

export default function TicketTypes() {
  return (
    <section id="tickets" className="py-20 px-6 md:px-12 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Choose Your <span className="text-indigo-600">Ticket Type</span>
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Select from a variety of event types, each providing a unique NFT that grants you access to exclusive
          communities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tickets.map((ticket, index) => {
          const Icon = ticket.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-indigo-600 transition-all hover:-translate-y-1"
            >
              <div className={`${ticket.color} p-6 flex justify-center`}>
                <Icon size={48} className={ticket.iconColor} />
              </div>
              <div className="p-6">
                <h3 className="text-xl text-gray-900 font-bold mb-3">{ticket.title}</h3>
                <p className="text-gray-700 mb-6">{ticket.description}</p>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-full hover:bg-purple-700 transition-colors">
                  View Events
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
