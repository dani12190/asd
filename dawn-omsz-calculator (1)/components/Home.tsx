"use client"

import { useState, useEffect } from "react"
import { Users, FolderOpen, Briefcase, Send, Edit2, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import WeeklyAnalysis from "./WeeklyAnalysis"

interface HomeProps {
  loggedInUser: string
}

interface Post {
  id: string
  title: string
  content: string
  date: string
}

interface Report {
  yourName: string
}

export default function Home({ loggedInUser }: HomeProps) {
  const [stats, setStats] = useState({
    userCount: 0,
    totalReports: 0,
    userReports: 0,
  })
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editPost, setEditPost] = useState({ title: "", content: "" })

  useEffect(() => {
    // Load stats
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const reports = JSON.parse(localStorage.getItem("reports") || "[]") as Report[]
    const currentUser = users.find((user: any) => user.username === loggedInUser)
    const userReports = reports.filter((report) => report.yourName === currentUser?.fullName)

    setStats({
      userCount: users.length,
      totalReports: reports.length,
      userReports: userReports.length,
    })

    // Load posts
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]")
    setPosts(savedPosts)
  }, [loggedInUser])

  const handlePostSubmit = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    // Add arrow emoji at the start of each line if it doesn't already have one
    const formattedContent = newPost.content
      .split("\n")
      .map((line) => (line.trim().startsWith("➜") ? line : `➜ ${line}`))
      .join("\n")

    const post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: formattedContent,
      date: new Date().toLocaleString("hu-HU"),
    }

    const updatedPosts = [post, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("posts", JSON.stringify(updatedPosts))
    setNewPost({ title: "", content: "" })
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post.id)
    setEditPost({ title: post.title, content: post.content })
  }

  const handleSaveEdit = (postId: string) => {
    // Add arrow emoji at the start of each line if it doesn't already have one
    const formattedContent = editPost.content
      .split("\n")
      .map((line) => (line.trim().startsWith("➜") ? line : `➜ ${line}`))
      .join("\n")

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            title: editPost.title,
            content: formattedContent,
            date: new Date().toLocaleString("hu-HU") + " (szerkesztve)",
          }
        : post,
    )
    setPosts(updatedPosts)
    localStorage.setItem("posts", JSON.stringify(updatedPosts))
    setEditingPost(null)
    setEditPost({ title: "", content: "" })
  }

  const handleDelete = (postId: string) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a bejegyzést?")) {
      const updatedPosts = posts.filter((post) => post.id !== postId)
      setPosts(updatedPosts)
      localStorage.setItem("posts", JSON.stringify(updatedPosts))
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center bg-cyan-500 text-white rounded-lg p-4">
          <Users className="w-12 h-12 mr-4" />
          <div>
            <div className="text-sm opacity-90">FELHASZNÁLÓK SZÁMA</div>
            <div className="text-2xl font-bold">{stats.userCount}</div>
          </div>
        </div>
        <div className="flex items-center bg-red-500 text-white rounded-lg p-4">
          <FolderOpen className="w-12 h-12 mr-4" />
          <div>
            <div className="text-sm opacity-90">MEGÍRT JELENTÉSEK</div>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </div>
        </div>
        <div className="flex items-center bg-green-500 text-white rounded-lg p-4">
          <Briefcase className="w-12 h-12 mr-4" />
          <div>
            <div className="text-sm opacity-90">ÁLTALAD MEGÍRT JELENTÉSEK</div>
            <div className="text-2xl font-bold">{stats.userReports}</div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <Card className="p-6">
        {loggedInUser === "asd" && <h2 className="text-2xl font-bold mb-4">Bejegyzések</h2>}
        {loggedInUser === "asd" && (
          <div className="space-y-2 mb-6">
            <Input
              placeholder="Cím"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full"
            />
            <Textarea
              placeholder="Tartalom..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full min-h-[100px] font-mono"
            />
            <Button onClick={handlePostSubmit} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Közzététel
            </Button>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="space-y-2 border-b pb-4">
              {editingPost === post.id && loggedInUser === "asd" ? (
                <div className="space-y-2">
                  <Input
                    value={editPost.title}
                    onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                    className="w-full"
                  />
                  <Textarea
                    value={editPost.content}
                    onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                    className="w-full min-h-[100px] font-mono"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveEdit(post.id)}
                      className="flex items-center gap-2"
                      variant="default"
                    >
                      <Save className="w-4 h-4" />
                      Mentés
                    </Button>
                    <Button onClick={() => setEditingPost(null)} className="flex items-center gap-2" variant="outline">
                      <X className="w-4 h-4" />
                      Mégse
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {loggedInUser === "asd" && (
                    <div className="absolute right-0 top-0 flex gap-2">
                      <Button onClick={() => handleEdit(post)} size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <pre className="font-mono whitespace-pre-wrap text-base mt-2">{post.content}</pre>
                  {loggedInUser === "asd" && <p className="text-gray-500 text-sm mt-2">{post.date}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Analysis (csak az "asd" felhasználó számára) */}
      {loggedInUser === "asd" && <WeeklyAnalysis />}
    </div>
  )
}

