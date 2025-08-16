"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2, Twitter, Linkedin, Facebook, Copy, Check, Trophy } from "lucide-react"

interface SocialShareProps {
  type: "level_complete" | "quest_complete" | "game_complete" | "nft_earned" | "achievement"
  title: string
  description: string
  questId?: number
  levelId?: number
  playerName?: string
  customText?: string
}

export function SocialShare({
  type,
  title,
  description,
  questId,
  levelId,
  playerName = "Player",
  customText,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const getShareText = () => {
    if (customText) return customText

    const baseText = `🎉 Just achieved something awesome in Espresso Quest! `

    switch (type) {
      case "level_complete":
        return `${baseText}Completed Level ${questId}.${levelId}: ${title}! 🚀 Ready to master blockchain technology with @EspressoSys #EspressoQuest #Blockchain #Learning`

      case "quest_complete":
        return `${baseText}Finished Quest ${questId}: ${title}! One step closer to joining the Espresso Foundation 🏆 #EspressoQuest #Achievement #Blockchain`

      case "game_complete":
        return `${baseText}🎊 GAME COMPLETED! 🎊 I've mastered all 4 Espresso Quest challenges and earned the Master NFT! Ready to build the future of blockchain with @EspressoSys 🚀 #EspressoQuest #Blockchain #Achievement`

      case "nft_earned":
        return `${baseText}Just earned a composable NFT: ${title}! Building my collection piece by piece 🧩 #NFT #EspressoQuest #Collectibles`

      case "achievement":
        return `${baseText}${title}! ${description} 🎯 #EspressoQuest #Achievement`

      default:
        return `${baseText}Learning blockchain technology through gamification! Join me at Espresso Quest 🎮 #EspressoQuest #Blockchain`
    }
  }

  const gameUrl = "https://espresso-quest.vercel.app"
  const shareText = getShareText()
  const encodedText = encodeURIComponent(shareText)
  const encodedUrl = encodeURIComponent(gameUrl)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${gameUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = `${shareText} ${gameUrl}`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/90 border-amber-300 text-amber-700 hover:bg-amber-50">
          <Share2 className="h-4 w-4 mr-2" />
          Share Achievement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            Share Your Success
          </DialogTitle>
          <DialogDescription>Let your network know about your Espresso Quest achievement!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-amber-900">{playerName}</h3>
                    <Badge className="bg-green-100 text-green-800">Achievement</Badge>
                  </div>
                  <h4 className="font-medium text-amber-800 mb-1">{title}</h4>
                  <p className="text-sm text-amber-700">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-sm text-gray-700 italic">{shareText}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => window.open(shareLinks.twitter, "_blank")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>

            <Button
              onClick={() => window.open(shareLinks.linkedin, "_blank")}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>

            <Button
              onClick={() => window.open(shareLinks.facebook, "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>

            <Button onClick={copyToClipboard} variant="outline" className="border-gray-300 bg-transparent">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
