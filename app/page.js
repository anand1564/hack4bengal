import Navbar from "./components/navbar"
import HeroSection from "./components/heroSection"
import TicketTypes from "./components/ticketTypes"
import HowItWorks from "./components/howItWorks"
import Benefits from "./components/benefits"
import Footer from "./components/footer"
import TicketTear from "./components/ticketTear"

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="bg-white">
        <Navbar />
        <HeroSection />
      </div>

      <TicketTypes />

      <div className="bg-indigo-600 text-white">
        <HowItWorks />
        <Benefits />
        <TicketTear />
      </div>

      <div className="bg-white">
        <Footer />
      </div>
    </main>
  )
}
