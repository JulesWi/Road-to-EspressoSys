"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Trophy, Users, Zap, Target, Star, Award } from "lucide-react"
import { useGameState } from "@/hooks/use-game-state"

export function WelcomeScreen() {
  const { setCurrentScreen } = useGameState()

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url(/images/cafe-terrace-1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <Card className="relative z-10 w-full max-w-4xl bg-amber-50/95 backdrop-blur-sm border-4 border-amber-800 rounded-3xl shadow-2xl">
        <CardHeader className="text-center space-y-6 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-t-3xl p-8">
          <div className="flex justify-center">
            <Coffee className="h-20 w-20 text-amber-200" />
          </div>
          <CardTitle className="text-5xl font-bold tracking-wide">Espresso Quest</CardTitle>
          <CardDescription className="text-xl text-amber-100 max-w-2xl mx-auto">
            Embark on an epic adventure to join the high spheres of the Espresso Foundation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          <div className="bg-amber-100 rounded-2xl p-6 border-2 border-amber-300">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Target className="h-6 w-6" />
              Mission & Objectives
            </h2>
            <div className="space-y-4 text-amber-800">
              <p className="text-lg leading-relaxed">
                <strong>Your Mission:</strong> Rise through the ranks of the Espresso Foundation by demonstrating your
                knowledge and skills across four challenging quests.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Game Flow:
                  </h3>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Complete 3 quiz levels per quest</li>
                    <li>• Solve NFT composable puzzles</li>
                    <li>• Meet with foundation leaders</li>
                    <li>• Unlock exclusive rewards</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Social Features:
                  </h3>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Ask colleagues for help</li>
                    <li>• Manage debts and favors</li>
                    <li>• Earn meeting tickets</li>
                    <li>• Collect composable NFTs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl border-2 border-amber-400">
              <Trophy className="h-10 w-10 text-amber-800 mb-3" />
              <h3 className="font-bold text-amber-900 text-lg">4 Quests</h3>
              <p className="text-sm text-amber-700">Progressive challenges</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl border-2 border-amber-400">
              <Users className="h-10 w-10 text-amber-800 mb-3" />
              <h3 className="font-bold text-amber-900 text-lg">Boss Meetings</h3>
              <p className="text-sm text-amber-700">Coffee conversations</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl border-2 border-amber-400">
              <Zap className="h-10 w-10 text-amber-800 mb-3" />
              <h3 className="font-bold text-amber-900 text-lg">NFT Rewards</h3>
              <p className="text-sm text-amber-700">Composable collectibles</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl border-2 border-amber-400">
              <Coffee className="h-10 w-10 text-amber-800 mb-3" />
              <h3 className="font-bold text-amber-900 text-lg">Social Play</h3>
              <p className="text-sm text-amber-700">Help & collaboration</p>
            </div>
          </div>

          <div className="text-center space-y-6 bg-white rounded-2xl p-6 border-2 border-amber-300">
            <p className="text-amber-800 text-lg leading-relaxed">
              Test your knowledge about Espresso's history, team, community activities, and technical innovations. Each
              completed quest brings you closer to the summit and unlocks exclusive NFT composables!
            </p>

            <Button
              onClick={() => setCurrentScreen("registration")}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-12 py-4 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Your Adventure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
