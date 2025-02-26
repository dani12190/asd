"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

const services = [
  { id: "VIZS", name: "Vizsgálat", shortName: "(VIZS)", price: 50000 },
  { id: "KOT", name: "Kötözés", shortName: "(KÖT)", price: 15000 },
  { id: "GIP", name: "Gipszelés", shortName: "(GIP)", price: 20000 },
  { id: "GYOGY", name: "Gyógyszerezés", shortName: "(GYÓGY)", price: 9000 },
  { id: "MT", name: "Műtét", shortName: "(MT)", price: 35000 },
  { id: "TH", name: "Téves hívás", shortName: "(TH)", price: 60000 },
]

interface CalculatorProps {
  onReportSubmit: (selectedServices: string[], total: number) => void
}

export default function Calculator({ onReportSubmit }: CalculatorProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const total = selectedServices.reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId)
    return sum + (service?.price || 0)
  }, 0)

  const handleReportSubmit = () => {
    if (selectedServices.length > 0) {
      const selectedServiceNames = selectedServices
        .map((id) => services.find((s) => s.id === id)?.name)
        .filter(Boolean) as string[]
      onReportSubmit(selectedServiceNames, total)
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="border-b">
        <CardTitle>Kalkulátor</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 px-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center space-x-3">
              <Checkbox
                id={service.id}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => handleServiceToggle(service.id)}
                className="w-5 h-5"
              />
              <label
                htmlFor={service.id}
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {service.name} {service.shortName}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center border-t pt-6">
        <div className="text-2xl font-semibold mb-4">
          Ár: <span className="text-blue-500">{total.toLocaleString("hu-HU")} $</span>
        </div>
        <Button
          onClick={handleReportSubmit}
          className={cn(
            "bg-[#3498db] hover:bg-[#2980b9] w-full max-w-xs text-white text-base py-3",
            selectedServices.length === 0 && "opacity-50 cursor-not-allowed",
          )}
          disabled={selectedServices.length === 0}
        >
          <PenLine className="w-4 h-4 mr-2" />
          Jelentés írása
        </Button>
      </CardFooter>
    </Card>
  )
}

