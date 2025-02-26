"use client"

import { useEffect } from "react"

export default function WeeklyReset() {
  useEffect(() => {
    const checkTimeAndReset = () => {
      const now = new Date()
      const day = now.getDay()
      const hour = now.getHours()
      const minute = now.getMinutes()

      if (day === 0 && hour === 20 && minute === 0) {
        // Mentsük el az elemzést az "asd" felhasználó számára
        const services = JSON.parse(localStorage.getItem("services") || "[]")
        const reports = JSON.parse(localStorage.getItem("reports") || "[]")
        const analysis = {
          date: now.toISOString(),
          services,
          reports,
        }
        const previousAnalyses = JSON.parse(localStorage.getItem("weeklyAnalyses") || "[]")
        localStorage.setItem("weeklyAnalyses", JSON.stringify([...previousAnalyses, analysis]))

        // Reseteljük az adatokat
        localStorage.setItem("services", "[]")
        localStorage.setItem("reports", "[]")

        console.log("Weekly reset performed")
      }
    }

    const interval = setInterval(checkTimeAndReset, 60000) // Ellenőrzés percenként

    return () => clearInterval(interval)
  }, [])

  return null
}

