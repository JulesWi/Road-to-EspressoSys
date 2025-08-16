"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Trophy, Star, Sparkles } from "lucide-react"
import { SocialShare } from "./social-share"

interface CertificateAnimationProps {
  questId: number
  questTitle: string
  playerName: string
  onComplete: () => void
}

export function CertificateAnimation({ questId, questTitle, playerName, onComplete }: CertificateAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<"appearing" | "displaying" | "completed">("appearing")
  const [showDownload, setShowDownload] = useState(false)

  const certificateImages = [
    "/images/certificates/certificate-1.png", // Quest 1
    "/images/certificates/certificate-2.png", // Quest 2
    "/images/certificates/certificate-3.png", // Quest 3
    "/images/certificates/certificate-4.png", // Quest 4
  ]

  const currentCertificate = certificateImages[questId - 1] || certificateImages[0]

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase("displaying")
    }, 1000)

    const timer2 = setTimeout(() => {
      setShowDownload(true)
    }, 2500)

    const timer3 = setTimeout(() => {
      setAnimationPhase("completed")
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const handleDownloadCertificate = () => {
    const link = document.createElement("a")
    link.href = currentCertificate
    link.download = `espresso-quest-${questId}-certificate-${playerName.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleContinue = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900/90 via-amber-800/90 to-amber-700/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Sparkles className="h-4 w-4 text-amber-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div
          className={`transform transition-all duration-1000 ${
            animationPhase === "appearing"
              ? "scale-0 rotate-12 opacity-0"
              : animationPhase === "displaying"
                ? "scale-100 rotate-0 opacity-100"
                : "scale-105 rotate-0 opacity-100"
          }`}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-4 border-amber-400 shadow-2xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div
                    className={`transform transition-all duration-1000 delay-500 ${
                      animationPhase !== "appearing" ? "scale-100 rotate-0" : "scale-0 rotate-180"
                    }`}
                  >
                    <Trophy className="h-16 w-16 text-amber-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-amber-900 mb-2">Quest Completed!</h1>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-lg px-4 py-2">
                  Level {questId} Achievement
                </Badge>
              </div>

              <div className="flex justify-center mb-6">
                <div
                  className={`relative transform transition-all duration-1000 delay-700 ${
                    animationPhase !== "appearing" ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-amber-400/30 rounded-lg blur-xl animate-pulse"></div>
                  <img
                    src={currentCertificate || "/placeholder.svg"}
                    alt={`Quest ${questId} Certificate`}
                    className="relative w-48 h-48 object-cover rounded-lg border-4 border-amber-300 shadow-lg"
                  />
                </div>
              </div>

              <div
                className={`text-center space-y-4 transform transition-all duration-1000 delay-1000 ${
                  animationPhase !== "appearing" ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="bg-amber-50 rounded-lg p-6 border-2 border-amber-200">
                  <h2 className="text-xl font-semibold text-amber-900 mb-2">Certificate of Completion</h2>
                  <p className="text-amber-800 mb-3">
                    This certifies that <span className="font-bold text-amber-900">{playerName}</span>
                  </p>
                  <p className="text-amber-800 mb-3">
                    has successfully completed <span className="font-bold text-amber-900">{questTitle}</span>
                  </p>
                  <p className="text-amber-700 text-sm">
                    Demonstrating excellence in blockchain technology and Espresso Systems knowledge
                  </p>

                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                    <span className="text-amber-800 font-medium">Espresso Systems Foundation</span>
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center mt-8 transform transition-all duration-1000 delay-1500 ${
                  showDownload ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Button
                  onClick={handleDownloadCertificate}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Certificate
                </Button>

                <Button
                  onClick={handleContinue}
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 px-6 py-3 text-lg bg-transparent"
                  size="lg"
                >
                  Continue Journey
                </Button>
              </div>

              <div className="mt-6">
                <SocialShare
                  achievement={`Quest ${questId} Completed!`}
                  description={`Just completed ${questTitle} in Espresso Quest! 🏆`}
                  url="https://espressosys.com"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">Quest {questId} of 4 completed • Your Espresso journey continues!</p>
        </div>
      </div>
    </div>
  )
}
