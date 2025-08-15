"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/hooks/use-game-state"
import { QUEST_THEMES, BOSS_DIALOGUES } from "@/lib/game-state"
import { Coffee, Trophy } from "lucide-react"

interface DialogueBubble {
  speaker: "player" | "boss"
  text: string
  emotion?: string
}

export function MeetingScreen() {
  const {
    currentQuest,
    meetingProgress,
    updateMeetingProgress,
    setCurrentScreen,
    player,
    unlockNextQuest,
    getPlayerProgress,
  } = useGameState()

  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true) // Auto-advance dialogues

  const currentQuestData = QUEST_THEMES.find((q) => q.id === currentQuest)
  const bossDialogues = BOSS_DIALOGUES[currentQuest as keyof typeof BOSS_DIALOGUES] || []
  const progress = getPlayerProgress()

  // Create full conversation including player responses
  const fullConversation: DialogueBubble[] = [
    {
      speaker: "player",
      text: `Bonjour ! Je viens de terminer tous les niveaux sur ${currentQuestData?.title.toLowerCase()}. J'ai hâte de discuter avec vous !`,
    },
    ...bossDialogues.map((dialogue) => ({
      speaker: "boss" as const,
      text: dialogue.text,
      emotion: dialogue.emotion,
    })),
    {
      speaker: "player",
      text: "Merci beaucoup pour cet échange enrichissant ! J'ai appris énormément et je suis motivé pour la suite de mon parcours.",
    },
    {
      speaker: "boss",
      text: "C'était un plaisir de vous rencontrer. Votre progression est impressionnante. Bonne chance pour la suite de votre aventure chez Espresso !",
      emotion: "encouraging",
    },
  ]

  // Typewriter effect with auto-advance
  useEffect(() => {
    if (currentDialogue < fullConversation.length) {
      const dialogue = fullConversation[currentDialogue]
      setIsTyping(true)
      setDisplayedText("")

      let index = 0
      const timer = setInterval(() => {
        if (index < dialogue.text.length) {
          setDisplayedText(dialogue.text.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          clearInterval(timer)

          if (autoAdvance && currentDialogue < fullConversation.length - 1) {
            setTimeout(() => {
              setCurrentDialogue((prev) => prev + 1)
            }, 3000)
          }
        }
      }, 30) // Faster typing speed

      return () => clearInterval(timer)
    }
  }, [currentDialogue, autoAdvance])

  // Auto-complete meeting when all dialogues are shown
  useEffect(() => {
    if (currentDialogue >= fullConversation.length - 1 && !isTyping) {
      const timer = setTimeout(() => {
        handleMeetingComplete()
      }, 4000) // Wait 4 seconds after last dialogue

      return () => clearTimeout(timer)
    }
  }, [currentDialogue, isTyping])

  const handleMeetingComplete = () => {
    unlockNextQuest()

    if (currentQuest < QUEST_THEMES.length) {
      // Go back to hub to show progress
      setCurrentScreen("game")
    } else {
      // All quests completed - go to completion screen
      setCurrentScreen("complete")
    }
  }

  const getBackgroundImage = () => {
    const backgrounds = [
      "/images/cafe-terrace-1.jpg",
      "/images/cafe-japanese.jpg",
      "/images/cafe-terrace-1.jpg",
      "/images/cafe-japanese.jpg",
    ]
    return backgrounds[(currentQuest - 1) % backgrounds.length]
  }

  const getBossEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case "happy":
      case "encouraging":
        return "border-green-400 bg-green-50"
      case "impressed":
      case "amazed":
        return "border-blue-400 bg-blue-50"
      case "proud":
      case "visionary":
        return "border-purple-400 bg-purple-50"
      case "welcoming":
      case "curious":
        return "border-amber-400 bg-amber-50"
      default:
        return "border-gray-400 bg-gray-50"
    }
  }

  if (currentDialogue >= fullConversation.length) {
    return null
  }

  const currentSpeaker = fullConversation[currentDialogue]

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Meeting Header */}
        <Card className="bg-white/95 backdrop-blur-sm border-amber-200 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Coffee className="h-8 w-8 text-amber-600" />
                <div>
                  <h1 className="text-2xl font-bold text-amber-900">Café Espresso</h1>
                  <p className="text-amber-700">Rencontre avec {currentQuestData?.boss}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 mb-1">
                  Niveau {currentQuest}
                </Badge>
                <div className="text-xs text-amber-600">
                  Progression: {progress.completed + 1}/{progress.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative mb-6">
          {/* Terrace Table Setup */}
          <div className="flex items-end justify-center gap-8 mb-8">
            {/* Player Avatar - Seated */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Chair */}
                <div className="w-16 h-20 bg-amber-800 rounded-lg mb-2 shadow-lg"></div>
                {/* Player Avatar */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src="/images/avatar-female.jpg" alt="Player Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="font-semibold text-white text-lg drop-shadow-lg">{player?.name}</h3>
                <p className="text-white/80 text-sm drop-shadow">{player?.domain}</p>
              </div>
            </div>

            {/* Coffee Table */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-16 bg-amber-900 rounded-full shadow-lg flex items-center justify-center mb-2">
                <Coffee className="h-8 w-8 text-amber-200" />
              </div>
              <div className="text-xs text-white/60">Table de café</div>
            </div>

            {/* Boss Avatar - Seated */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Chair */}
                <div className="w-16 h-20 bg-amber-800 rounded-lg mb-2 shadow-lg"></div>
                {/* Boss Avatar */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="font-semibold text-white text-lg drop-shadow-lg">{currentQuestData?.boss}</h3>
                <p className="text-white/80 text-sm drop-shadow">Espresso Foundation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <Card
            className={`bg-white/95 backdrop-blur-sm border-2 transition-all duration-500 max-w-2xl ${
              currentSpeaker.speaker === "boss"
                ? getBossEmotionColor(currentSpeaker.emotion)
                : "border-blue-400 bg-blue-50"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    currentSpeaker.speaker === "boss" ? "bg-amber-600 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {currentSpeaker.speaker === "boss" ? (
                    <Trophy className="h-6 w-6" />
                  ) : (
                    <span className="font-bold">{player?.name?.charAt(0).toUpperCase() || "P"}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {currentSpeaker.speaker === "boss" ? currentQuestData?.boss : player?.name}
                    </h4>
                    {currentSpeaker.emotion && (
                      <Badge variant="outline" className="text-xs">
                        {currentSpeaker.emotion}
                      </Badge>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <p className="text-gray-800 leading-relaxed">
                      {displayedText}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {fullConversation.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentDialogue ? "bg-amber-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <p className="text-white/80 text-sm">
            {currentDialogue + 1} / {fullConversation.length}
          </p>

          {/* Manual control option */}
          <div className="mt-4">
            <Button
              onClick={() => setAutoAdvance(!autoAdvance)}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {autoAdvance ? "Mode Manuel" : "Mode Auto"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
