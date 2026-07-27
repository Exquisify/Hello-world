"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

const NotificationContext = createContext(undefined)

const MAX_NOTIFICATIONS = 50

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const eventSourceRef = useRef(null)

  useEffect(() => {
    let eventSource
    let cancelled = false

    const connect = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok || cancelled) return
        const { user } = await response.json()
        if (user.notificationPreferences?.inApp === false || cancelled) {
          setNotifications([])
          return
        }
      } catch {
        return
      }

      eventSource = new EventSource("/api/notifications/stream")
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data)
          setNotifications((prev) => [notification, ...prev].slice(0, MAX_NOTIFICATIONS))
        } catch {
          // Ignore malformed events rather than tearing down the connection.
        }
      }

      eventSource.onerror = () => {
        // EventSource retries connections automatically.
      }
    }
    connect()

    return () => {
      cancelled = true
      eventSource?.close()
      eventSourceRef.current = null
    }
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])

  const markAsUnread = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: false } : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    clearAll,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
