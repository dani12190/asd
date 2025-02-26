"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface User {
  username: string
  fullName: string
  password: string
  rank: string
}

interface AccountManagementProps {
  loggedInUser: string
}

const RANKS = [
  "Gyakorló Mentőápoló",
  "Mentőápoló",
  "Mentőszakápoló",
  "Mentőtechnikus",
  "Mentőtiszt",
  "Orvos",
  "Rezidens",
  "Fő Orvos",
  "Mentésvezető",
  "Regionális Vezető",
  "Orvos igazgató",
  "Igazgató helyettes",
  "Igazgató",
  "Főigazgató helyettes",
  "Főigazgató",
]

export default function AccountManagement({ loggedInUser }: AccountManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ username: "", fullName: "", password: "", rank: "" })
  const [showPasswords, setShowPasswords] = useState(false)

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    if (storedUsers.length === 0) {
      // Ha nincs felhasználó, adjuk hozzá az alapértelmezett "asd" felhasználót
      const defaultUser = { username: "asd", password: "1134", fullName: "Admin", rank: "Főigazgató" }
      localStorage.setItem("users", JSON.stringify([defaultUser]))
      setUsers([defaultUser])
    } else {
      setUsers(storedUsers)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setNewUser({ username: "", fullName: "", password: "", rank: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleDeleteUser = (username: string) => {
    if (username === "asd") {
      alert("Az 'asd' felhasználót nem lehet törölni!")
      return
    }
    const updatedUsers = users.filter((user) => user.username !== username)
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  const toggleShowPasswords = () => {
    setShowPasswords((prev) => !prev)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fiókkezelés</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Felhasználónév:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-2">
            Teljes név:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={newUser.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Jelszó:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rank" className="block mb-2">
            Rendfokozat:
          </label>
          <select
            id="rank"
            name="rank"
            value={newUser.rank}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Válassz rendfokozatot</option>
            {RANKS.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Új fiók létrehozása
        </button>
      </form>

      <h3 className="text-xl font-bold mb-2">Létrehozott fiókok</h3>
      {loggedInUser === "asd" && (
        <button
          onClick={toggleShowPasswords}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          {showPasswords ? "Jelszavak elrejtése" : "Jelszavak megjelenítése"}
        </button>
      )}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.username} className="flex items-center justify-between p-2 border rounded">
            <span>
              {user.username} ({user.fullName}) - {user.rank}
            </span>
            {loggedInUser === "asd" && showPasswords && <span className="mx-2 text-gray-600">{user.password}</span>}
            {user.username !== "asd" && (
              <button
                onClick={() => handleDeleteUser(user.username)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Törlés
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

