"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { User2, Lock } from "lucide-react"

interface LoginProps {
  onLogin: (username: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find(
      (u: { username: string; password: string }) => u.username === username && u.password === password,
    )
    if (user) {
      onLogin(username)
    } else {
      setError("Hibás felhasználónév vagy jelszó.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-3xl font-normal">
            DawnMTA <span className="font-semibold text-gray-800">OMSZ</span>
          </h1>
          <p className="text-gray-600">Kérjük jelentkezz be!</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Felhasználónév"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
              <User2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button type="submit" className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white text-base py-3">
              Bejelentkezés
            </Button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

