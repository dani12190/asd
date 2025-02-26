"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserAnalysis {
  name: string
  totalMinutes: number
  reportCount: number
}

export default function WeeklyAnalysis() {
  const [analysis, setAnalysis] = useState<UserAnalysis[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const day = now.getDay()
      const hour = now.getHours()

      if (day === 0 && hour >= 20 && hour < 21) {
        setIsVisible(true)
        performAnalysis()
      } else {
        setIsVisible(false)
      }
    }

    checkTime()
    const interval = setInterval(checkTime, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const performAnalysis = () => {
    const services = JSON.parse(localStorage.getItem("services") || "[]")
    const reports = JSON.parse(localStorage.getItem("reports") || "[]")

    const userAnalysis: { [key: string]: UserAnalysis } = {}

    services.forEach((service: any) => {
      if (!userAnalysis[service.serviceName]) {
        userAnalysis[service.serviceName] = { name: service.serviceName, totalMinutes: 0, reportCount: 0 }
      }
      userAnalysis[service.serviceName].totalMinutes += service.durationInMinutes
    })

    reports.forEach((report: any) => {
      if (!userAnalysis[report.yourName]) {
        userAnalysis[report.yourName] = { name: report.yourName, totalMinutes: 0, reportCount: 0 }
      }
      userAnalysis[report.yourName].reportCount += 1
    })

    setAnalysis(Object.values(userAnalysis))
  }

  if (!isVisible) return null

  return (
    <Card className="mt-6">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Heti Elemzés</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Összes szolgálati idő (perc)</TableHead>
              <TableHead>Leadott jelentések száma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analysis.map((user) => (
              <TableRow key={user.name}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.totalMinutes}</TableCell>
                <TableCell>{user.reportCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

