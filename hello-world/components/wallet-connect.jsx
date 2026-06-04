"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

// Simple Stellar wallet interface using Freighter or standard Stellar wallets
const StellarInterface = {
  async connectWallet() {
    // Check if Freighter wallet is installed
    if (typeof window !== 'undefined' && window.freighterApi) {
      try {
        const result = await window.freighterApi.requestAccess()
        return { success: true, address: result.address }
      } catch (error) {
        return { success: false, error: "Wallet access denied" }
      }
    }
    
    // Fallback for development/testing
    return { success: false, error: "No Stellar wallet detected. Install Freighter." }
  },

  async disconnectWallet() {
    // Stellar wallets typically handle disconnect via the wallet UI
    return { success: true }
  },

  async signTransaction(transaction) {
    if (typeof window !== 'undefined' && window.freighterApi) {
      return await window.freighterApi.signTransaction(transaction)
    }
    throw new Error("No Stellar wallet detected")
  }
}

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (isConnected) {
      await StellarInterface.disconnectWallet()
      setIsConnected(false)
      setAddress(null)
      return
    }

    setIsConnecting(true)
    try {
      const result = await StellarInterface.connectWallet()
      if (result.success) {
        setIsConnected(true)
        setAddress(result.address)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? (
        "Connecting..."
      ) : isConnected ? (
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
        </span>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}