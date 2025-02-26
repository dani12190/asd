"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, FileText } from "lucide-react"

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
  globalIndex?: number
}

interface ReportOverviewProps {
  loggedInUser: string
}

export default function ReportOverview({ loggedInUser }: ReportOverviewProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [currentUserName, setCurrentUserName] = useState("")

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]")
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUser = users.find((user: { username: string; fullName: string }) => user.username === loggedInUser)
    if (currentUser) {
      setCurrentUserName(currentUser.fullName)
    }
    setReports(storedReports)
  }, [loggedInUser])

  const handleDelete = (reportId: string) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a jelentést?")) {
      const updatedReports = reports.filter((report) => report.id !== reportId)
      setReports(updatedReports)
      localStorage.setItem("reports", JSON.stringify(updatedReports))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString("hu-HU")}$`
  }

  // Szűrjük a jelentéseket a felhasználó alapján
  const filteredReports =
    loggedInUser === "asd" ? reports : reports.filter((report) => report.yourName === currentUserName)

  const totalReports = filteredReports.length
  const totalAmount = filteredReports.reduce((sum, report) => sum + report.ticket, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-4">Jelentések áttekintése</h2>

      {/* Statisztikai kártya minden felhasználó számára látható */}
      <Card className="bg-white">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="bg-[#4caf50] p-4 rounded-full">
            <FileText className="h-16 w-16 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">ÖSSZES JELENTÉS</div>
            <div className="text-2xl font-bold">{totalReports} db</div>
          </div>
          <div className="ml-auto">
            <div className="text-sm font-medium text-gray-500">ÖSSZES BEVÉTEL</div>
            <div className="text-2xl font-bold">{formatAmount(totalAmount)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Felhasználók összesítése csak admin számára */}
      {loggedInUser === "asd" && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Felhasználók összesítése</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Felhasználó</TableHead>
                <TableHead>Jelentések száma</TableHead>
                <TableHead>Összes bevétel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(
                reports.reduce(
                  (acc, report) => {
                    if (!acc[report.yourName]) {
                      acc[report.yourName] = { count: 0, total: 0 }
                    }
                    acc[report.yourName].count++
                    acc[report.yourName].total += report.ticket
                    return acc
                  },
                  {} as Record<string, { count: number; total: number }>,
                ),
              ).map(([name, data]) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{data.count} db</TableCell>
                  <TableCell>{formatAmount(data.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                <TableHead>Név</TableHead>
                <TableHead>Társ neve</TableHead>
                <TableHead>Társ rendfokozata</TableHead>
                <TableHead>Esetleírás</TableHead>
                <TableHead>Ticket</TableHead>
                <TableHead>Kép</TableHead>
                <TableHead>Létrehozás</TableHead>
                <TableHead className="text-center">Kezelés</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{report.yourName}</TableCell>
                  <TableCell>{report.colleagueName}</TableCell>
                  <TableCell>{report.colleagueRank}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{report.caseDescription}</TableCell>
                  <TableCell className="font-mono">{formatAmount(report.ticket)}</TableCell>
                  <TableCell>
                    {report.imageLink ? (
                      <a
                        href={report.imageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Kép link
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{formatDate(report.date)}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <button className="text-green-500 hover:text-green-700">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(report.id)}>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

