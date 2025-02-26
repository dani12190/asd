"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Login from "@/components/Login"
import Calculator from "@/components/Calculator"
import ServiceSubmission from "@/components/ServiceSubmission"
import ReportSubmission from "@/components/ReportSubmission"
import AccountManagement from "@/components/AccountManagement"
import Home from "@/components/Home"
import { HomeIcon, FileText, Clock, CalculatorIcon, ChevronDown, PenLine, Eye, User, LogOut } from "lucide-react"
import ReportOverview from "@/components/ReportOverview"
import ServiceOverview from "@/components/ServiceOverview"
import { Toaster } from "@/components/ui/toaster"
import WeeklyReset from "@/components/WeeklyReset"
import { useInactivityTimer } from "@/hooks/useInactivityTimer"
import { useToast } from "@/components/ui/use-toast"

export default function Page() {
  const [loggedInUser, setLoggedInUser] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isServiceOpen, setIsServiceOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([{ username: "asd", password: "1134" }]))
    }
  }, [])

  const handleLogout = useCallback(() => {
    setLoggedInUser("")
    setActiveTab("home")
  }, [])

  const handleInactivity = useCallback(() => {
    if (loggedInUser) {
      handleLogout()
      toast({
        title: "Automatikus kijelentkezés",
        description: "60 perc inaktivitás miatt kijelentkeztél.",
        variant: "destructive",
      })
    }
  }, [loggedInUser, handleLogout, toast])

  const resetInactivityTimer = useInactivityTimer(handleInactivity)

  useEffect(() => {
    if (loggedInUser) {
      resetInactivityTimer()
    }
  }, [loggedInUser, resetInactivityTimer])

  const handleReportSubmit = useCallback(
    (services: string[], total: number) => {
      setSelectedServices(services)
      setTotalAmount(total)
      setActiveTab("report")
      resetInactivityTimer()
    },
    [resetInactivityTimer],
  )

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab)
      resetInactivityTimer()
    },
    [resetInactivityTimer],
  )

  const handleDropdownToggle = useCallback(
    (dropdown: "report" | "service") => {
      if (dropdown === "report") {
        setIsReportOpen((prev) => !prev)
      } else {
        setIsServiceOpen((prev) => !prev)
      }
      resetInactivityTimer()
    },
    [resetInactivityTimer],
  )

  if (!loggedInUser) {
    return <Login onLogin={setLoggedInUser} />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 flex flex-col items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dawn-FZylJbKyncItm1SfYPddPV1sWadcxU.png"
            alt="Dawn Logo"
            width={100}
            height={100}
            className="mb-6"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-2">
            <button
              className={`w-full text-left px-4 py-2 rounded transition-colors duration-300 relative ${
                activeTab === "home"
                  ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3498db]"
                  : ""
              }`}
              onClick={() => handleTabChange("home")}
            >
              <div className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4" />
                <span>Főoldal</span>
              </div>
            </button>

            <button
              className={`w-full text-left px-4 py-2 rounded transition-colors duration-300 relative ${
                activeTab === "calculator"
                  ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3498db]"
                  : ""
              }`}
              onClick={() => handleTabChange("calculator")}
            >
              <div className="flex items-center gap-2">
                <CalculatorIcon className="w-4 h-4" />
                <span>Kalkulátor</span>
              </div>
            </button>

            {/* Jelentés Dropdown */}
            <div className="relative mb-1">
              <button
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-800 rounded transition-colors duration-300"
                onClick={() => handleDropdownToggle("report")}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Jelentés</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform duration-500 ease-in-out ${
                    isReportOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isReportOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-1 bg-gray-800 rounded mt-1">
                  <button
                    className={`w-full text-left px-4 py-2 transition-colors duration-300 ${
                      activeTab === "report" ? "bg-gray-700" : ""
                    } flex items-center group`}
                    onClick={() => handleTabChange("report")}
                  >
                    <PenLine className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="group-hover:text-white transition-colors duration-300">Jelentés</span>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 transition-colors duration-300 ${
                      activeTab === "report-overview" ? "bg-gray-700" : ""
                    } flex items-center group`}
                    onClick={() => handleTabChange("report-overview")}
                  >
                    <Eye className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="group-hover:text-white transition-colors duration-300">Áttekintés</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Szolgálat Dropdown */}
            <div className="relative mb-1">
              <button
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-800 rounded transition-colors duration-300"
                onClick={() => handleDropdownToggle("service")}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Szolgálat</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform duration-500 ease-in-out ${
                    isServiceOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isServiceOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-1 bg-gray-800 rounded mt-1">
                  <button
                    className={`w-full text-left px-4 py-2 transition-colors duration-300 ${
                      activeTab === "service" ? "bg-gray-700" : ""
                    } flex items-center group`}
                    onClick={() => handleTabChange("service")}
                  >
                    <PenLine className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="group-hover:text-white transition-colors duration-300">Szolgálat leadás</span>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 transition-colors duration-300 ${
                      activeTab === "service-overview" ? "bg-gray-700" : ""
                    } flex items-center group`}
                    onClick={() => handleTabChange("service-overview")}
                  >
                    <Eye className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="group-hover:text-white transition-colors duration-300">Áttekintés</span>
                  </button>
                </div>
              </div>
            </div>

            {loggedInUser === "asd" && (
              <button
                className={`w-full text-left px-4 py-2 rounded transition-colors duration-300 relative ${
                  activeTab === "account"
                    ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3498db]"
                    : ""
                }`}
                onClick={() => handleTabChange("account")}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Fiókkezelés</span>
                </div>
              </button>
            )}

            <div className="mt-2">
              <button
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded transition-colors duration-300"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Kijelentkezés</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* OMSZ logó az alján */}
        <div className="p-4 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Insignia_Hungary_OMSZ_v1.svg-Of6nD33NVKikqpSCWwV8zU8cZ4VAmh.png"
            alt="OMSZ Logo"
            width={100}
            height={100}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === "home" && <Home loggedInUser={loggedInUser} />}
        {activeTab === "calculator" && <Calculator onReportSubmit={handleReportSubmit} />}
        {activeTab === "service" && <ServiceSubmission loggedInUser={loggedInUser} />}
        {activeTab === "report" && (
          <ReportSubmission loggedInUser={loggedInUser} selectedServices={selectedServices} totalAmount={totalAmount} />
        )}
        {activeTab === "account" && loggedInUser === "asd" && <AccountManagement loggedInUser={loggedInUser} />}
        {activeTab === "report-overview" && <ReportOverview loggedInUser={loggedInUser} />}
        {activeTab === "service-overview" && <ServiceOverview loggedInUser={loggedInUser} />}
      </div>
      <Toaster />
      <WeeklyReset />
    </div>
  )
}

