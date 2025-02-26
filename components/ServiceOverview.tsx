"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Pencil, X, TrendingUp } from "lucide-react"

interface Service {
  id: string
  serviceName: string
  serviceRank: string
  serviceStart: string
  serviceEnd: string
  durationInMinutes: number
  createdAt: string
  globalIndex?: number
}

interface ServiceOverviewProps {
  loggedInUser: string
}

export default function ServiceOverview({ loggedInUser }: ServiceOverviewProps) {
  const [services, setServices] = useState<Service[]>([])
  const [currentUserName, setCurrentUserName] = useState("")
  const [topServiceMinutes, setTopServiceMinutes] = useState(0)
  const [userServiceMinutes, setUserServiceMinutes] = useState(0)

  useEffect(() => {
    const loadServices = () => {
      const storedServices = JSON.parse(localStorage.getItem("services") || "[]")
      const servicesWithIndex = storedServices.map((service: Service, index: number) => ({
        ...service,
        globalIndex: index + 1,
      }))
      setServices(servicesWithIndex)

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const currentUser = users.find((user: { username: string; fullName: string }) => user.username === loggedInUser)
      if (currentUser) {
        setCurrentUserName(currentUser.fullName)
      }

      // Számoljuk ki a legtöbb szolgálati percet és a felhasználó perceit
      const userMinutes = servicesWithIndex
        .filter((service: Service) => service.serviceName === currentUser?.fullName)
        .reduce((sum: number, service: Service) => sum + service.durationInMinutes, 0)

      const servicesByUser = servicesWithIndex.reduce((acc: { [key: string]: number }, service: Service) => {
        acc[service.serviceName] = (acc[service.serviceName] || 0) + service.durationInMinutes
        return acc
      }, {})

      const maxMinutes = Math.max(...Object.values(servicesByUser))
      setTopServiceMinutes(maxMinutes)
      setUserServiceMinutes(userMinutes)
    }

    loadServices()
    window.addEventListener("servicesUpdated", loadServices)

    return () => {
      window.removeEventListener("servicesUpdated", loadServices)
    }
  }, [loggedInUser])

  // Szűrjük a szolgálatokat a felhasználó alapján
  const filteredServices =
    loggedInUser === "asd" ? services : services.filter((service) => service.serviceName === currentUserName)

  const totalMinutes = filteredServices.reduce((total, service) => total + service.durationInMinutes, 0)

  const formatDateTime = (dateString: string) => {
    return new Date(dateString)
      .toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "")
  }

  const handleDelete = (serviceId: string) => {
    const updatedServices = services.filter((service) => service.id !== serviceId)
    const servicesWithUpdatedIndex = updatedServices.map((service, index) => ({
      ...service,
      globalIndex: index + 1,
    }))
    setServices(servicesWithUpdatedIndex)
    localStorage.setItem("services", JSON.stringify(updatedServices))
  }

  const minutesToBeFirst = Math.max(0, topServiceMinutes - userServiceMinutes + 1)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-4">Szolgálatok áttekintése</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="bg-[#00bcd4] p-4 rounded-full">
              <Clock className="h-16 w-16 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">EDDIG LEJELENTETT IDŐ</div>
              <div className="text-2xl font-bold">{totalMinutes} perc</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="bg-[#00a65a] p-4 rounded-full">
              <TrendingUp className="h-16 w-16 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">ENNYI KELL, HOGY ELSŐ LEGYÉL</div>
              <div className="text-2xl font-bold">{minutesToBeFirst} perc</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Szolgálati jelentések</h2>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Név</TableHead>
                <TableHead>Rendfokozat</TableHead>
                <TableHead>Szolgálat kezdete</TableHead>
                <TableHead>Szolgálat vége</TableHead>
                <TableHead>Szolgálatban töltött idő</TableHead>
                <TableHead>Létrehozás</TableHead>
                <TableHead className="w-[100px] text-center">Kezelés</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    Nincsenek szolgálati jelentések.
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.globalIndex}</TableCell>
                    <TableCell>{service.serviceName}</TableCell>
                    <TableCell>{service.serviceRank}</TableCell>
                    <TableCell>{formatDateTime(service.serviceStart)}</TableCell>
                    <TableCell>{formatDateTime(service.serviceEnd)}</TableCell>
                    <TableCell>{service.durationInMinutes} perc</TableCell>
                    <TableCell>{formatDateTime(service.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <button className="text-green-500 hover:text-green-700">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(service.id)}>
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

