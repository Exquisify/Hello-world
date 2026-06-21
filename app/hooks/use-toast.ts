"use client"

import * as React from "react"

const TOAST_LIMIT = 1

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  open?: boolean
}

type Toast = Omit<ToasterToast, "id">

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const listeners: Array<(toast: ToasterToast) => void> = []

function dispatch(toast: ToasterToast) {
  listeners.forEach((listener) => {
    listener(toast)
  })
}

function toast({ ...props }: Toast) {
  const id = genId()
  
  const newToast = {
    ...props,
    id,
    open: true,
  }

  dispatch(newToast)

  return {
    id: id,
    dismiss: () => {},
    update: () => {},
  }
}

function useToast() {
  return {
    toast,
    dismiss: () => {},
  }
}

export { useToast, toast }