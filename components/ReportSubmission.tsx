"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Report {
  id: string
  yourName: string
  rank: string
  colleagueName: string
  colleagueRank: string
  caseDescription: string
  ticket: number
  imageLink: string
  date: string
}

interface ReportSubmissionProps {
  loggedInUser: string
  selectedServices: string[]
  totalAmount: number
}

export default function ReportSubmission({ loggedInUser, selectedServices, totalAmount }: ReportSubmissionProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [newReport, setNewReport] = useState({
    yourName: "",
    rank: "",
    colleagueName: "",
    colleagueRank: "",
    caseDescription: selectedServices.join(", "),
    ticket: totalAmount,
    imageLink: "",
  })

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]")
    setReports(storedReports)

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUser = users.find(
      (user: { username: string; fullName: string; rank: string }) => user.username === loggedInUser,
    )
    if (currentUser) {
      setNewReport((prev) => ({
        ...prev,
        yourName: currentUser.fullName || "",
        rank: currentUser.rank || "",
      }))
    }
  }, [loggedInUser])

  useEffect(() => {
    setNewReport((prev) => ({
      ...prev,
      caseDescription: selectedServices.join(", "),
      ticket: totalAmount,
    }))
  }, [selectedServices, totalAmount])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const formattedDate = now.toLocaleString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    const reportToAdd: Report = {
      id: Date.now().toString(),
      ...newReport,
      date: formattedDate,
    }

    const updatedReports = [...reports, reportToAdd]
    setReports(updatedReports)
    localStorage.setItem("reports", JSON.stringify(updatedReports))
    setNewReport((prev) => ({
      ...prev,
      colleagueName: "",
      colleagueRank: "",
      caseDescription: "",
      ticket: 0,
      imageLink: "",
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewReport((prev) => ({ ...prev, [name]: name === "ticket" ? Number.parseFloat(value) || 0 : value }))
  }

  const formatAmount = (amount: number) => {
    return `${Math.floor(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$`
  }

  const userReportSummary = reports.reduce(
    (acc, report) => {
      const key = `${report.yourName} (${report.colleagueName} - ${report.colleagueRank})`
      if (!acc[key]) {
        acc[key] = { count: 0, total: 0, images: [] }
      }
      acc[key].count++
      acc[key].total += report.ticket
      if (report.imageLink) {
        acc[key].images.push(report.imageLink)
      }
      return acc
    },
    {} as Record<string, { count: number; total: number; images: string[] }>,
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Jelentés Leadás</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="yourName" className="block mb-2">
            Neved:
          </label>
          <input
            type="text"
            id="yourName"
            name="yourName"
            value={newReport.yourName}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rank" className="block mb-2">
            Rendfokozatod:
          </label>
          <input
            type="text"
            id="rank"
            name="rank"
            value={newReport.rank}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="colleagueName" className="block mb-2">
            Társad neve:
          </label>
          <input
            type="text"
            id="colleagueName"
            name="colleagueName"
            value={newReport.colleagueName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="colleagueRank" className="block mb-2">
            Társad rendfokozata:
          </label>
          <input
            type="text"
            id="colleagueRank"
            name="colleagueRank"
            value={newReport.colleagueRank}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="caseDescription" className="block mb-2">
            Eset leírása:
          </label>
          <textarea
            id="caseDescription"
            name="caseDescription"
            value={newReport.caseDescription}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ticket" className="block mb-2">
            Ticket ($):
          </label>
          <input
            type="number"
            id="ticket"
            name="ticket"
            value={newReport.ticket}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
            step="1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageLink" className="block mb-2">
            Kép:
          </label>
          <input
            type="url"
            id="imageLink"
            name="imageLink"
            value={newReport.imageLink}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Képek (imguros link)"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Jelentés elküldése
        </button>
      </form>

      {loggedInUser === "asd" && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Jelentések Összegzése</h3>
          {Object.entries(userReportSummary).map(([name, data], index) => (
            <Card key={index} className="mb-4">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2">{name} Jelentései:</h4>
                <p>Jelentések száma: {data.count} db</p>
                <p>Összes összeg: {formatAmount(data.total)}</p>
                <p>Képek száma: {data.images.length}</p>
                {data.images.length > 0 && (
                  <details>
                    <summary className="cursor-pointer text-blue-500 hover:text-blue-700 mt-2">Képek mutatása</summary>
                    <ul className="list-disc pl-5 mt-2">
                      {data.images.map((link, imgIndex) => (
                        <li key={imgIndex}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Kép {imgIndex + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

