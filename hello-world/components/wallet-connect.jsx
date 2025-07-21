"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarkNetInterface } from "@/lib/starknet-interface"
import { useToast } from "@/hooks/use-toast"

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    if (isConnected) {
      // Disconnect wallet
      await StarkNetInterface.disconnectWallet()
      setIsConnected(false)
      setAddress(null)
      toast({
        title: "Wallet disconnected",
        description: "Your StarkNet wallet has been disconnected",
      })
      return
    }

    // Connect wallet
    setIsConnecting(true)
    try {
      const result = await StarkNetInterface.connectWallet()
      if (result.success) {
        setIsConnected(true)
        setAddress(result.address ||  null)
        toast({
          title: "Wallet connected",
          description: "Your StarkNet wallet has been connected successfully",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: result.error || "Failed to connect wallet",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "An unexpected error occurred while connecting your wallet",
      })
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