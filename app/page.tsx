"use client"

import { useEffect } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { WelcomeScreen } from "@/components/welcome-screen"
import { RegistrationScreen } from "@/components/registration-screen"
import { GameHub } from "@/components/game-hub"
import { QuizScreen } from "@/components/quiz-screen"
import { PuzzleScreen } from "@/components/puzzle-screen"
import { MeetingScreen } from "@/components/meeting-screen"
import { CompletionScreen } from "@/components/completion-screen"

export default function HomePage() {
  const { currentScreen, resetGame } = useGameState()

  useEffect(() => {
    const handleBeforeUnload = () => {
      resetGame()
    }

    // Reset game immediately on component mount (page refresh)
    resetGame()

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [resetGame])

  switch (currentScreen) {
    case "welcome":
      return <WelcomeScreen />
    case "registration":
      return <RegistrationScreen />
    case "game":
      return <GameHub />
    case "quiz":
      return <QuizScreen />
    case "puzzle":
      return <PuzzleScreen />
    case "meeting":
      return <MeetingScreen />
    case "complete":
      return <CompletionScreen />
    default:
      return <WelcomeScreen />
  }
}
