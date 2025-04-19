
import { MessageSquare, Shield, Repeat, Award } from "lucide-react"

export default function Benefits() {
  const benefits = [
    {
      icon: MessageSquare,
      title: "Exclusive Chat Access",
      description: "Join private communities with fellow event attendees and speakers",
    },
    {
      icon: Shield,
      title: "Secure & Verifiable",
      description: "Blockchain-based tickets that can't be counterfeited or duplicated",
    },
    {
      icon: Repeat,
      title: "Resellable",
      description: "Transfer or sell your tickets on supported marketplaces",
    },
    {
      icon: Award,
      title: "Collectible Memorabilia",
      description: "Keep your NFT tickets as digital souvenirs of your experiences",
    },
  ]

  return (
    <section id="benefits" className="py-20 px-6 md:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          NFT <span className="text-white">Benefits</span>
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          More than just a ticket - a gateway to exclusive experiences and communities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <div key={index} className="flex gap-4">
              <div className="bg-white/10 p-3 rounded-lg h-fit">
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/80">{benefit.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
