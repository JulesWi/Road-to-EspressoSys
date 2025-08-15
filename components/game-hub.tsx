"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useGameState } from "@/hooks/use-game-state"
import { QUEST_THEMES } from "@/lib/game-state"
import { Coffee, Trophy, Lock, CheckCircle, Star, Target } from "lucide-react"

export function GameHub() {
  const {
    player,
    currentQuest,
    currentLevel,
    setCurrentQuest,
    setCurrentLevel,
    setCurrentScreen,
    updateQuizProgress,
    canAccessQuest,
    canAccessLevel,
    getPlayerProgress,
    getLevelProgress,
    completeLevel,
  } = useGameState()

  const startLevel = (questId: number, levelId: number) => {
    if (!canAccessLevel(questId, levelId)) return

    setCurrentQuest(questId)
    setCurrentLevel(levelId)
    updateQuizProgress({
      currentQuestion: 0,
      score: 0,
      answers: [],
    })
    setCurrentScreen("quiz")
  }

  const progress = getPlayerProgress()

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-6 border-4 border-amber-800 shadow-lg">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              Hey {player?.name}, get yourself ready, team isn't joking there!
            </h1>
            <div className="flex items-center justify-center gap-4 text-amber-800">
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                <span className="font-semibold">{player?.domain}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Floor {player?.currentLevel}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-lg p-4 border-2 border-amber-600">
              <h3 className="font-bold text-amber-900 mb-2">Progress</h3>
              <div className="text-2xl font-bold text-amber-800">
                {progress.completed}/{progress.total}
              </div>
              <div className="text-sm text-amber-700">Quests Completed</div>
            </div>

            <div className="bg-white/80 rounded-lg p-4 border-2 border-amber-600">
              <h3 className="font-bold text-amber-900 mb-2">Links</h3>
              <div className="space-y-1 text-sm text-amber-800">
                <div>• Documentation</div>
                <div>• Community</div>
                <div>• Support</div>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-4 border-2 border-amber-600">
              <h3 className="font-bold text-amber-900 mb-2">Skill Level</h3>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-amber-900">
                    {progress.completed === 0
                      ? "Junior"
                      : progress.completed === 1
                        ? "Intermediate"
                        : progress.completed === 2
                          ? "Advanced"
                          : progress.completed === 3
                            ? "Senior"
                            : "Expert"}
                  </div>
                  <div className="text-xs text-amber-700">Level {progress.completed + 1}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {QUEST_THEMES.map((quest) => {
            const questLevelProgress = getLevelProgress(quest.id)
            const isQuestCompleted = questLevelProgress.completed === questLevelProgress.total
            const isQuestUnlocked = canAccessQuest(quest.id)
            const isCurrentQuest = quest.id === currentQuest

            return (
              <div
                key={quest.id}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-4 border-amber-800 shadow-lg overflow-hidden"
              >
                {/* Header */}
                <div className="bg-amber-100 p-4 border-b-2 border-amber-800">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-amber-900 mb-1">{quest.title}</h2>
                    <p className="text-sm text-amber-700">{quest.description}</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 space-y-4">
                  {/* Quest Info */}
                  <div className="bg-white/80 rounded-lg p-3 border-2 border-amber-600">
                    <h3 className="font-bold text-amber-900 mb-2">Information about selected field</h3>
                    <div className="text-sm text-amber-800 space-y-1">
                      <div>Boss: {quest.boss}</div>
                      <div>Levels: {quest.levels.length}</div>
                      <div>Status: {isQuestCompleted ? "Completed" : isQuestUnlocked ? "Available" : "Locked"}</div>
                    </div>
                  </div>

                  {!isQuestUnlocked && quest.id > 1 && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-300">
                      Complete Quest {quest.id - 1} to unlock this quest
                    </div>
                  )}

                  {/* Level Selection */}
                  {isQuestUnlocked && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-amber-900">Available Levels:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {quest.levels.map((level) => {
                          const isLevelCompleted =
                            player?.completedLevels?.some((l) => l.questId === quest.id && l.levelId === level.id) ||
                            false
                          const isLevelUnlocked = canAccessLevel(quest.id, level.id)

                          return (
                            <Button
                              key={level.id}
                              onClick={() => startLevel(quest.id, level.id)}
                              disabled={!isLevelUnlocked}
                              variant="outline"
                              className={`h-auto p-3 justify-start text-left border-2 ${
                                isLevelCompleted
                                  ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                                  : isLevelUnlocked
                                    ? "bg-amber-50 border-amber-400 text-amber-900 hover:bg-amber-100"
                                    : "bg-gray-100 border-gray-300 text-gray-500"
                              }`}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="flex-shrink-0">
                                  {isLevelCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : isLevelUnlocked ? (
                                    <Target className="h-4 w-4 text-amber-600" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-sm">{level.title}</div>
                                  <div className="text-xs opacity-75">{level.description}</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {level.questions.length}Q
                                </Badge>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {isQuestUnlocked && (
                    <div className="bg-white/80 rounded-lg p-3 border-2 border-amber-600">
                      <div className="flex justify-between text-sm text-amber-700 mb-1">
                        <span>Level Progress</span>
                        <span>
                          {questLevelProgress.completed}/{questLevelProgress.total}
                        </span>
                      </div>
                      <Progress value={questLevelProgress.percentage} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {progress.completed === progress.total && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-8 border-4 border-green-600 text-center">
            <Trophy className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-900 mb-2">Congratulations!</h2>
            <p className="text-green-700 mb-4">
              You have completed all quests and levels! Claim your Master Espresso composable NFT.
            </p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setCurrentScreen("complete")}
            >
              <Star className="h-5 w-5 mr-2" />
              Claim Master NFT
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
