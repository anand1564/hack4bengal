"use client"
import { useState } from "react"
import { ethers } from "ethers"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!")
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setWalletAddress(accounts[0])
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const truncateAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <nav className="py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-indigo-600">NFTickets</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-gray-800 hover:text-indigo-600 transition-colors">
          Home
        </a>
        <a href="#tickets" className="text-gray-800 hover:text-indigo-600 transition-colors">
          Tickets
        </a>
        <a href="#how-it-works" className="text-gray-800 hover:text-indigo-600 transition-colors">
          How It Works
        </a>
        <a href="#benefits" className="text-gray-800 hover:text-indigo-600 transition-colors">
          Benefits
        </a>
        {walletAddress ? (
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">{truncateAddress(walletAddress)}</span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-6 z-50 md:hidden">
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-gray-800 hover:text-indigo-600 transition-colors">
              Home
            </a>
            <a href="#tickets" className="text-gray-800 hover:text-indigo-600 transition-colors">
              Tickets
            </a>
            <a href="#how-it-works" className="text-gray-800 hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="text-gray-800 hover:text-indigo-600 transition-colors">
              Benefits
            </a>
            {walletAddress ? (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-center">
                {truncateAddress(walletAddress)}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
