"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GameState, Player } from "@/lib/game-state"
import type { SocialGameState } from "@/lib/social-mechanics"

interface GameStore extends GameState {
  socialState: SocialGameState | null
  setSocialState: (socialState: SocialGameState) => void
  updateSocialState: (updates: Partial<SocialGameState>) => void
  initializeSocialState: () => void

  setPlayer: (player: Player) => void
  setCurrentScreen: (screen: GameState["currentScreen"]) => void
  setCurrentQuest: (quest: number) => void
  setCurrentLevel: (level: number) => void
  updateQuizProgress: (progress: Partial<GameState["quizProgress"]>) => void
  updateMeetingProgress: (progress: Partial<GameState["meetingProgress"]>) => void
  completeQuest: (questId: number) => void
  completeLevel: (questId: number, levelId: number) => void
  resetGame: () => void
  canAccessQuest: (questId: number) => boolean
  canAccessLevel: (questId: number, levelId: number) => boolean
  getPlayerProgress: () => { completed: number; total: number; percentage: number }
  getLevelProgress: (questId: number) => { completed: number; total: number; percentage: number }
  unlockNextQuest: () => void
  unlockNextLevel: () => void
  useHelp: (creditCost: number) => boolean

  downloadCertificate: (questId: number) => void
  getCertificateUrl: (questId: number) => string
}

const initialState: GameState = {
  player: null,
  currentScreen: "welcome",
  currentQuest: 1,
  currentLevel: 1,
  quizProgress: {
    currentQuestion: 0,
    score: 0,
    answers: [],
  },
  meetingProgress: {
    currentDialogue: 0,
    bossLevel: 1,
  },
}

const initialSocialState: SocialGameState = {
  helpUsed: 0,
  debts: [],
  helpRequests: [],
  canRequestHelp: true,
  lastHelpRequest: null,
  meetingTickets: [
    { questId: 1, hasTicket: true },
    { questId: 2, hasTicket: true },
    { questId: 3, hasTicket: true },
    { questId: 4, hasTicket: true },
  ],
  seasonEnded: false,
}

export const useGameState = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      socialState: null,

      initializeSocialState: () => set({ socialState: initialSocialState }),

      setSocialState: (socialState) => set({ socialState }),

      updateSocialState: (updates) =>
        set((state) => ({
          socialState: state.socialState ? { ...state.socialState, ...updates } : null,
        })),

      setPlayer: (player) => {
        set({ player })
        const state = get()
        if (!state.socialState) {
          state.initializeSocialState()
        }
      },

      setCurrentScreen: (currentScreen) => set({ currentScreen }),

      setCurrentLevel: (currentLevel) => {
        console.log("[v0] Setting current level to:", currentLevel)
        set({ currentLevel })
        set({
          quizProgress: {
            currentQuestion: 0,
            score: 0,
            answers: [],
          },
        })
      },

      setCurrentQuest: (currentQuest) => {
        set({ currentQuest, currentLevel: 1 })
        set({
          quizProgress: {
            currentQuestion: 0,
            score: 0,
            answers: [],
          },
        })
      },

      updateQuizProgress: (progress) =>
        set((state) => ({
          quizProgress: { ...state.quizProgress, ...progress },
        })),

      updateMeetingProgress: (progress) =>
        set((state) => ({
          meetingProgress: { ...state.meetingProgress, ...progress },
        })),

      completeQuest: (questId) =>
        set((state) => {
          if (!state.player) return state

          const isAlreadyCompleted = state.player.completedQuests.includes(questId)
          if (isAlreadyCompleted) return state

          const updatedPlayer = {
            ...state.player,
            completedQuests: [...state.player.completedQuests, questId].sort((a, b) => a - b),
            currentLevel: Math.max(state.player.currentLevel, questId),
          }

          return { player: updatedPlayer }
        }),

      completeLevel: (questId, levelId) =>
        set((state) => {
          if (!state.player) return state

          console.log("[v0] Completing level:", questId, levelId)

          const levelKey = { questId, levelId }
          const isAlreadyCompleted = state.player.completedLevels.some(
            (level) => level.questId === questId && level.levelId === levelId,
          )

          if (isAlreadyCompleted) {
            console.log("[v0] Level already completed:", questId, levelId)
            return state
          }

          const updatedPlayer = {
            ...state.player,
            completedLevels: [...state.player.completedLevels, levelKey],
          }

          console.log("[v0] Updated completed levels:", updatedPlayer.completedLevels)
          return { player: updatedPlayer }
        }),

      canAccessQuest: (questId) => {
        const state = get()
        if (!state.player || !state.socialState) return false

        if (state.socialState.seasonEnded) return false

        const ticket = state.socialState.meetingTickets.find((t) => t.questId === questId)
        if (!ticket?.hasTicket) return false

        // First quest is always accessible
        if (questId === 1) return true

        // Other quests require ALL levels of previous quest to be completed
        const previousQuestLevels = state.getLevelProgress(questId - 1)
        return previousQuestLevels.completed === previousQuestLevels.total
      },

      canAccessLevel: (questId, levelId) => {
        const state = get()
        if (!state.player || !state.socialState) return false

        if (state.socialState.seasonEnded) return false

        console.log("[v0] Checking level access:", questId, levelId, {
          completedLevels: state.player.completedLevels,
          canAccessQuest: state.canAccessQuest(questId),
        })

        // First level of accessible quest is always accessible
        if (levelId === 1 && state.canAccessQuest(questId)) {
          console.log("[v0] First level of accessible quest - granted")
          return true
        }

        // Other levels require previous level completion
        const hasCompletedPrevious = state.player.completedLevels.some(
          (level) => level.questId === questId && level.levelId === levelId - 1,
        )

        console.log("[v0] Previous level completion check:", hasCompletedPrevious)
        return hasCompletedPrevious
      },

      getPlayerProgress: () => {
        const state = get()
        if (!state.player) return { completed: 0, total: 4, percentage: 0 }

        const completed = state.player.completedQuests.length
        const total = 4 // Total number of quests
        const percentage = Math.round((completed / total) * 100)

        return { completed, total, percentage }
      },

      getLevelProgress: (questId) => {
        const state = get()
        if (!state.player) return { completed: 0, total: 3, percentage: 0 }

        const completedLevels = state.player.completedLevels || []
        const completed = completedLevels.filter((level) => level.questId === questId).length
        const total = 3 // Each quest has 3 levels
        const percentage = Math.round((completed / total) * 100)

        return { completed, total, percentage }
      },

      unlockNextQuest: () => {
        const state = get()
        if (!state.player) return

        const nextQuestId = state.currentQuest + 1
        if (nextQuestId <= 4 && state.canAccessQuest(nextQuestId)) {
          set({ currentQuest: nextQuestId, currentLevel: 1 })
        }
      },

      unlockNextLevel: () => {
        const state = get()
        if (!state.player) return

        const nextLevelId = state.currentLevel + 1
        if (nextLevelId <= 3 && state.canAccessLevel(state.currentQuest, nextLevelId)) {
          set({ currentLevel: nextLevelId })
        }
      },

      useHelp: (creditCost: number) => {
        const state = get()
        if (!state.player || !state.socialState) return false

        if (state.player.credits < creditCost) return false

        // Deduct credits and increment help usage
        set((state) => ({
          player: state.player ? { ...state.player, credits: state.player.credits - creditCost } : null,
          socialState: state.socialState ? { ...state.socialState, helpUsed: state.socialState.helpUsed + 1 } : null,
        }))

        return true
      },

      resetGame: () => {
        set({ ...initialState, socialState: initialSocialState })
        // Clear persisted state to ensure complete reset
        localStorage.removeItem("espresso-quest-game")
      },

      downloadCertificate: (questId: number) => {
        const certificateImages = [
          "/images/certificates/certificate-1.png",
          "/images/certificates/certificate-2.png",
          "/images/certificates/certificate-3.png",
          "/images/certificates/certificate-4.png",
        ]

        const certificateUrl = certificateImages[questId - 1] || certificateImages[0]
        const state = get()
        const playerName = state.player?.name || "Player"

        const link = document.createElement("a")
        link.href = certificateUrl
        link.download = `espresso-quest-${questId}-certificate-${playerName.replace(/\s+/g, "-").toLowerCase()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },

      getCertificateUrl: (questId: number) => {
        const certificateImages = [
          "/images/certificates/certificate-1.png",
          "/images/certificates/certificate-2.png",
          "/images/certificates/certificate-3.png",
          "/images/certificates/certificate-4.png",
        ]
        return certificateImages[questId - 1] || certificateImages[0]
      },
    }),
    {
      name: "espresso-quest-game",
    },
  ),
)
