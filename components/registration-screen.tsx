"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGameState } from "@/hooks/use-game-state"
import type { Player } from "@/lib/game-state"
import { ArrowLeft, User, Coffee } from "lucide-react"

const DOMAINS = [
  "Blockchain Development",
  "Marketing & Communication",
  "Human Resources",
  "Finance & Investment",
  "Research & Development",
  "Community Management",
  "Design & UX/UI",
  "Business Development",
]

export function RegistrationScreen() {
  const { setPlayer, setCurrentScreen } = useGameState()
  const [formData, setFormData] = useState({
    name: "",
    gender: "" as "male" | "female" | "",
    domain: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.gender || !formData.domain) {
      return
    }

    const player: Player = {
      id: Date.now().toString(),
      name: formData.name,
      gender: formData.gender,
      domain: formData.domain,
      avatar: formData.gender === "female" ? "/images/avatar-female.jpg" : "/male-developer-avatar.png",
      currentLevel: 1,
      completedQuests: [],
      completedLevels: [], // Initialize as empty array
      nftCollected: false,
    }

    setPlayer(player)
    setCurrentScreen("game")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url(/images/cafe-japanese.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <Card className="relative z-10 w-full max-w-lg bg-amber-50/95 backdrop-blur-sm border-4 border-amber-800 rounded-3xl shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-t-3xl p-6">
          <div className="flex justify-center mb-4">
            <User className="h-16 w-16 text-amber-200" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Your Profile</CardTitle>
          <CardDescription className="text-amber-100 text-lg">
            Customize your avatar to begin the adventure
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="bg-amber-100 rounded-2xl p-4 mb-6 border-2 border-amber-300">
            <p className="text-amber-800 text-center font-medium flex items-center justify-center gap-2">
              <Coffee className="h-5 w-5" />
              Hey there! Get yourself ready, the team isn't joking around!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-900 font-bold text-lg">
                Player Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                className="border-2 border-amber-300 focus:border-amber-500 rounded-xl p-3 text-lg"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-amber-900 font-bold text-lg">Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value as "male" | "female" }))}
                className="flex gap-8 justify-center"
              >
                <div className="flex items-center space-x-3 bg-amber-100 p-3 rounded-xl border-2 border-amber-300">
                  <RadioGroupItem value="male" id="male" className="text-amber-600" />
                  <Label htmlFor="male" className="text-amber-800 font-medium text-lg cursor-pointer">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-amber-100 p-3 rounded-xl border-2 border-amber-300">
                  <RadioGroupItem value="female" id="female" className="text-amber-600" />
                  <Label htmlFor="female" className="text-amber-800 font-medium text-lg cursor-pointer">
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-amber-900 font-bold text-lg">Activity Domain</Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, domain: value }))}
              >
                <SelectTrigger className="border-2 border-amber-300 focus:border-amber-500 rounded-xl p-3 text-lg">
                  <SelectValue placeholder="Choose your domain" />
                </SelectTrigger>
                <SelectContent className="bg-amber-50 border-2 border-amber-300">
                  {DOMAINS.map((domain) => (
                    <SelectItem key={domain} value={domain} className="text-amber-800 hover:bg-amber-100">
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentScreen("welcome")}
                className="flex-1 border-2 border-amber-400 text-amber-700 hover:bg-amber-100 rounded-xl p-3 text-lg font-medium"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl p-3 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={!formData.name || !formData.gender || !formData.domain}
              >
                Start Quest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
