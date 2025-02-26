"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ServiceSubmissionProps {
  loggedInUser: string
}

export default function ServiceSubmission({ loggedInUser }: ServiceSubmissionProps) {
  const { toast } = useToast()
  const [newService, setNewService] = useState({
    serviceName: "",
    serviceRank: "",
    serviceStart: "",
    serviceEnd: "",
  })

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUser = users.find(
      (user: { username: string; fullName: string; rank: string }) => user.username === loggedInUser,
    )
    if (currentUser) {
      setNewService((prev) => ({
        ...prev,
        serviceName: currentUser.fullName || "",
        serviceRank: currentUser.rank || "",
      }))
    }
  }, [loggedInUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const startTime = new Date(newService.serviceStart).getTime()
    const endTime = new Date(newService.serviceEnd).getTime()
    const durationInMinutes = Math.floor((endTime - startTime) / (1000 * 60))

    if (durationInMinutes < 0) {
      toast({
        title: "Hiba",
        description: "A szolgálat vége nem lehet korábban, mint a kezdete!",
        variant: "destructive",
      })
      return
    }

    const serviceToAdd = {
      id: Date.now().toString(),
      ...newService,
      durationInMinutes,
      createdAt: new Date().toISOString(),
    }

    const storedServices = JSON.parse(localStorage.getItem("services") || "[]")
    const updatedServices = [...storedServices, serviceToAdd]
    localStorage.setItem("services", JSON.stringify(updatedServices))

    toast({
      title: "Sikeres leadás",
      description: "A szolgálat sikeresen leadva!",
    })

    setNewService((prev) => ({ ...prev, serviceStart: "", serviceEnd: "" }))

    // Frissítjük a szolgálatok listáját
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("servicesUpdated"))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Szolgálat Leadás</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <Label htmlFor="serviceName" className="block mb-2">
            Név:
          </Label>
          <Input
            type="text"
            id="serviceName"
            name="serviceName"
            value={newService.serviceName}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="serviceRank" className="block mb-2">
            Rendfokozat:
          </Label>
          <Input
            type="text"
            id="serviceRank"
            name="serviceRank"
            value={newService.serviceRank}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="serviceStart" className="block mb-2">
            Szolgálat kezdete:
          </Label>
          <Input
            type="datetime-local"
            id="serviceStart"
            name="serviceStart"
            value={newService.serviceStart}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="serviceEnd" className="block mb-2">
            Szolgálat vége:
          </Label>
          <Input
            type="datetime-local"
            id="serviceEnd"
            name="serviceEnd"
            value={newService.serviceEnd}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <Button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Szolgálat leadása
        </Button>
      </form>
    </div>
  )
}

