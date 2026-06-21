"use client"

import { useState, useEffect, useCallback } from "react"
import { Wallet, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "stellar_wallet_address"

// Transaction status constants
const TX_STATUS = {
  IDLE: "idle",
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
}

// Freighter API helpers
const freighter = () =>
  typeof window !== "undefined" ? window.freighterApi : null

async function getConnectedAddress() {
  const api = freighter()
  if (!api) return null
  try {
    const result = await api.getAddress()
    return result?.address ?? null
  } catch {
    return null
  }
}

export async function signTransaction(xdr, networkPassphrase = "Test SDF Network ; September 2015") {
  const api = freighter()
  if (!api) throw new Error("Freighter not installed")
  const result = await api.signTransaction(xdr, { networkPassphrase })
  if (result.error) throw new Error(result.error)
  return result.signedTxXdr
}

export function WalletConnect() {
  const [address, setAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [txStatus, setTxStatus] = useState(TX_STATUS.IDLE)
  const [error, setError] = useState(null)

  // Reconnect on page refresh if previously connected
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    getConnectedAddress().then((addr) => {
      if (addr) {
        setAddress(addr)
        localStorage.setItem(STORAGE_KEY, addr)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    })
  }, [])

  const handleConnect = useCallback(async () => {
    const api = freighter()
    if (!api) {
      setError("Freighter not installed. Please install the Freighter browser extension.")
      return
    }

    setIsConnecting(true)
    setError(null)
    try {
      await api.requestAccess()
      const addr = await getConnectedAddress()
      if (addr) {
        setAddress(addr)
        localStorage.setItem(STORAGE_KEY, addr)
      } else {
        throw new Error("Could not retrieve wallet address.")
      }
    } catch (err) {
      const msg = err?.message ?? "Wallet connection rejected."
      setError(msg.includes("User declined") || msg.includes("reject") ? "Connection rejected." : msg)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const handleDisconnect = useCallback(() => {
    setAddress(null)
    setTxStatus(TX_STATUS.IDLE)
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Exposed utility: sign a transaction and track status
  const handleSignTransaction = useCallback(async (xdr) => {
    if (!address) {
      setError("Wallet not connected.")
      return null
    }
    setTxStatus(TX_STATUS.PENDING)
    setError(null)
    try {
      const signed = await signTransaction(xdr)
      setTxStatus(TX_STATUS.SUCCESS)
      return signed
    } catch (err) {
      const msg = err?.message ?? "Transaction failed."
      setError(msg.includes("User declined") || msg.includes("reject") ? "Transaction rejected." : msg)
      setTxStatus(TX_STATUS.FAILED)
      return null
    }
  }, [address])

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={address ? handleDisconnect : handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {isConnecting ? (
          "Connecting..."
        ) : address ? (
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {shortAddress}
          </span>
        ) : (
          "Connect Wallet"
        )}
      </Button>

      {txStatus === TX_STATUS.PENDING && (
        <span className="flex items-center gap-1 text-xs text-yellow-500">
          <Loader2 className="h-3 w-3 animate-spin" /> Transaction pending…
        </span>
      )}
      {txStatus === TX_STATUS.SUCCESS && (
        <span className="flex items-center gap-1 text-xs text-green-500">
          <CheckCircle2 className="h-3 w-3" /> Transaction confirmed
        </span>
      )}
      {txStatus === TX_STATUS.FAILED && (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <XCircle className="h-3 w-3" /> {error ?? "Transaction failed"}
        </span>
      )}
      {!address && error && txStatus === TX_STATUS.IDLE && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}
