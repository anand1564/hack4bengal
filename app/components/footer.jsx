import Link from "next/link"
import { Twitter, Instagram, Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-purple-500 mb-4">NFTickets</h3>
            <p className="text-gray-700 mb-4">
              Revolutionizing event ticketing with blockchain technology and exclusive community access.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-purple-500">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-500">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-500">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-500">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Events</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  Online Sessions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  In-Person Events
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  Upcoming Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  NFT Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-purple-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-gray-600">&copy; {new Date().getFullYear()} NFTickets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
