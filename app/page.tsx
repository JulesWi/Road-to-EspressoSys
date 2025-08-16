"use client"

import { useEffect } from "react"
import { useGameState } from "@/hooks/use-game-state"
import { WelcomeScreen } from "@/components/welcome-screen"
import { RegistrationScreen } from "@/components/registration-screen"
import { GameHub } from "@/components/game-hub"
import { QuizScreen } from "@/components/quiz-screen"
import { MeetingScreen } from "@/components/meeting-screen"
import { CompletionScreen } from "@/components/completion-screen"

/**
 * HomePage Component
 *
 * Main application router that manages screen transitions:
 * - welcome: Initial game introduction and description
 * - registration: Player signup with name, gender, domain selection
 * - game: Quest hub showing available quests and levels
 * - quiz: Interactive quiz gameplay with timer and help system
 * - meeting: Boss meetings after completing quest levels
 * - complete: Final completion screen with Master NFT
 *
 * Auto-resets game state on page refresh to ensure clean starts
 */
export default function HomePage() {
  const { currentScreen, resetGame } = useGameState()

  /**
   * Game Reset Effect
   * Ensures game always starts fresh on page load/refresh
   */
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

  /**
   * Screen Router
   * Renders appropriate component based on current game state
   */
  switch (currentScreen) {
    case "welcome":
      return <WelcomeScreen />
    case "registration":
      return <RegistrationScreen />
    case "game":
      return <GameHub />
    case "quiz":
      return <QuizScreen />
    case "meeting":
      return <MeetingScreen />
    case "complete":
      return <CompletionScreen />
    default:
      return <WelcomeScreen />
  }
}
