"use client"

import { useRef, useEffect, useCallback } from "react"

const INACTIVITY_TIMEOUT = 60 * 60 * 1000 // 60 minutes in milliseconds

export function useInactivityTimer(onInactive: () => void) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(onInactive, INACTIVITY_TIMEOUT)
  }, [onInactive])

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

    const handleActivity = () => {
      resetTimer()
    }

    events.forEach((event) => {
      document.addEventListener(event, handleActivity)
    })

    resetTimer() // Initial timer setup

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [resetTimer])

  return resetTimer
}

