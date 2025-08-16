"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/hooks/use-game-state"
import { QUEST_THEMES } from "@/lib/game-state"
import { Trophy, Download, Star, Coffee, RotateCcw, ExternalLink } from "lucide-react"
import { SocialShare } from "./social-share"

export function CompletionScreen() {
  const { player, resetGame, getPlayerProgress } = useGameState()
  const progress = getPlayerProgress()

  const downloadFinalNFT = () => {
    // Create a canvas for the final master NFT
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Create gradient background
      const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200)
      gradient.addColorStop(0, "#fbbf24")
      gradient.addColorStop(0.5, "#f59e0b")
      gradient.addColorStop(1, "#d97706")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 400, 400)

      // Add border
      ctx.strokeStyle = "#92400e"
      ctx.lineWidth = 8
      ctx.strokeRect(4, 4, 392, 392)

      // Add text
      ctx.fillStyle = "white"
      ctx.font = "bold 32px Arial"
      ctx.textAlign = "center"
      ctx.fillText("ESPRESSO", 200, 120)
      ctx.fillText("MASTER NFT", 200, 160)

      ctx.font = "24px Arial"
      ctx.fillText("QUEST COMPLETED", 200, 200)

      ctx.font = "18px Arial"
      ctx.fillText(player?.name || "Player", 200, 240)
      ctx.fillText(player?.domain || "", 200, 265)

      ctx.font = "16px Arial"
      ctx.fillText("All 4 Levels Mastered", 200, 300)
      ctx.fillText("Foundation Ready", 200, 325)

      // Add decorative elements
      ctx.fillStyle = "#fef3c7"
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const x = 200 + Math.cos(angle) * 150
        const y = 200 + Math.sin(angle) * 150
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()
      }

      // Download
      const link = document.createElement("a")
      link.download = `espresso-master-nft-${player?.name || "player"}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
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
      <div className="absolute inset-0 bg-black/60" />

      <Card className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-sm border-amber-200">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="h-24 w-24 text-amber-600" />
              <div className="absolute -top-2 -right-2">
                <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold text-amber-900">Congratulations!</CardTitle>
            <CardDescription className="text-xl text-amber-700">
              You have completed your Espresso Quest journey
            </CardDescription>
          </div>

          <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-4 py-2">
            Quest Mastered • {progress.percentage}% Completed
          </Badge>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Player Achievement Summary */}
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coffee className="h-6 w-6 text-amber-600" />
                <h3 className="text-xl font-semibold text-amber-900">Your Journey Summary</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">{player?.name}</div>
                  <div className="text-sm text-amber-700">{player?.domain}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">
                    {progress.completed}/{progress.total}
                  </div>
                  <div className="text-sm text-amber-700">Levels Completed</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-amber-900">Meetings Completed:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUEST_THEMES.map((quest) => (
                    <Badge key={quest.id} variant="outline" className="bg-white border-amber-300 text-amber-800">
                      {quest.boss}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Final NFT Section */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-lg border border-amber-300">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-amber-900">Master Composable NFT</h3>
              <p className="text-amber-700">
                You have unlocked the Espresso Master NFT! This unique token certifies your complete mastery of the
                Espresso ecosystem and your readiness to join the foundation.
              </p>

              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center border-4 border-white shadow-lg">
                <Trophy className="h-16 w-16 text-white" />
              </div>

              <Button onClick={downloadFinalNFT} size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                <Download className="h-5 w-5 mr-2" />
                Download Master NFT
              </Button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-amber-900">What's Next?</h3>
            <p className="text-amber-700">
              Your journey in Espresso Quest is complete, but your adventure with Espresso is just beginning! Use your
              knowledge to contribute to the ecosystem and join our community.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>

              <Button
                onClick={() => window.open("https://espressosys.com", "_blank")}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Espresso
              </Button>
            </div>
          </div>

          {/* Social Share Component */}
          <div className="border-t border-amber-200 pt-6">
            <SocialShare
              achievement="Espresso Quest Master!"
              description="Just completed the entire Espresso Quest journey! Ready to join the foundation! 🚀☕"
              url="https://espressosys.com"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
