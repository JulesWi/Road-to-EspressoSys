"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/hooks/use-game-state"
import { QUEST_THEMES } from "@/lib/game-state"
import { Coffee, Clock, Trophy, ArrowRight, CheckCircle, BookOpen, AlertTriangle } from "lucide-react"

export function QuizScreen() {
  const {
    currentQuest,
    currentLevel,
    quizProgress,
    updateQuizProgress,
    setCurrentScreen,
    setCurrentLevel,
    player,
    socialState,
    updateSocialState,
    completeLevel,
  } = useGameState()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(5)
  const [showHelpOption, setShowHelpOption] = useState(false)
  const [helpUsed, setHelpUsed] = useState(false)

  const currentQuestData = QUEST_THEMES.find((q) => q.id === currentQuest)
  const currentLevelData = currentQuestData?.levels.find((l) => l.id === currentLevel)
  const currentQuestion = currentLevelData?.questions[quizProgress.currentQuestion]

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      setShowHelpOption(true)
    }
  }, [timeLeft, showResult])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(5)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowHelpOption(false)
    setHelpUsed(false)
  }, [quizProgress.currentQuestion])

  const handleAnswer = (answerIndex: number | null) => {
    if (showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === currentQuestion?.correct
    const newScore = isCorrect ? quizProgress.score + 1 : quizProgress.score

    const newAnswers = [...quizProgress.answers]
    newAnswers[quizProgress.currentQuestion] =
      answerIndex !== null ? currentQuestion?.options[answerIndex] || null : null

    updateQuizProgress({
      score: newScore,
      answers: newAnswers,
    })
  }

  const handleUseHelpToContinue = () => {
    if (!player || !socialState) return

    const newHelpUsed = socialState.helpUsed + 1
    const shouldFreezeComposable = newHelpUsed >= 5

    updateSocialState({
      helpUsed: newHelpUsed,
      canRequestHelp: true, // Always allow help for each quiz
    })

    if (shouldFreezeComposable) {
      const updatedTickets = socialState.meetingTickets.map((ticket) =>
        ticket.questId === currentQuest ? { ...ticket, hasTicket: false } : ticket,
      )
      updateSocialState({
        meetingTickets: updatedTickets,
      })
    }

    setHelpUsed(true)
    // Continue to next question with credit
    updateQuizProgress({
      currentQuestion: quizProgress.currentQuestion + 1,
      score: quizProgress.score + 1,
    })
    setShowHelpOption(false)
  }

  const handleNextQuestion = () => {
    const isLastQuestion = quizProgress.currentQuestion >= (currentLevelData?.questions.length || 0) - 1

    if (isLastQuestion) {
      const totalQuestions = currentLevelData?.questions.length || 0
      const perfectScore = quizProgress.score === totalQuestions

      if (!perfectScore && !helpUsed) {
        // Restart level if not 100% and no help used
        updateQuizProgress({
          currentQuestion: 0,
          score: 0,
          answers: [],
        })
        return
      }

      completeLevel(currentQuest, currentLevel)

      const isLastLevel = currentLevel >= (currentQuestData?.levels.length || 0)

      if (isLastLevel) {
        setCurrentScreen("puzzle")
      } else {
        setCurrentLevel(currentLevel + 1)
      }
    } else {
      updateQuizProgress({
        currentQuestion: quizProgress.currentQuestion + 1,
      })
    }
  }

  const progressPercentage = currentLevelData
    ? ((quizProgress.currentQuestion + 1) / currentLevelData.questions.length) * 100
    : 0

  if (!currentQuestData || !currentLevelData || !currentQuestion) {
    return <div>Error: Quest or level not found</div>
  }

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
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Quiz Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-amber-200">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Level {currentQuest}.{currentLevel}
                </Badge>
                <BookOpen className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-xl font-bold">{timeLeft.toString().padStart(2, "0")}s</span>
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-amber-900">{currentLevelData.title}</CardTitle>
              <CardDescription className="text-amber-700">{currentLevelData.description}</CardDescription>
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border-2 border-amber-200">
                Quest: {currentQuestData.title}
              </div>
            </div>

            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">Help Used: {socialState?.helpUsed || 0}/9</span>
              </div>
              {(socialState?.helpUsed || 0) >= 4 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Next help freezes composable!</span>
                </div>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-semibold text-sm">100% Success Required</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                You must answer all questions correctly to pass this level. Wrong answers restart the level.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-amber-700">
                <span>
                  Question {quizProgress.currentQuestion + 1} of {currentLevelData.questions.length}
                </span>
                <span>
                  Score: {quizProgress.score}/{quizProgress.currentQuestion + (showResult ? 1 : 0)}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {showHelpOption && !showResult && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Time's Up!</span>
                </div>
                <p className="text-sm text-yellow-700 mb-4">
                  You can ask for help to continue to the next question, but it will cost you credits.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleUseHelpToContinue}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    disabled={(socialState?.helpUsed || 0) >= 9}
                  >
                    Ask for Help (10 credits)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Restart level
                      updateQuizProgress({
                        currentQuestion: 0,
                        score: 0,
                        answers: [],
                      })
                    }}
                  >
                    Restart Level
                  </Button>
                </div>
              </div>
            )}

            {!showHelpOption && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">{currentQuestion.question}</h3>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = "justify-start text-left h-auto p-4 border-2 transition-all duration-200"

                    if (showResult) {
                      if (index === currentQuestion.correct) {
                        buttonClass += " bg-green-100 border-green-400 text-green-800"
                      } else if (index === selectedAnswer && index !== currentQuestion.correct) {
                        buttonClass += " bg-red-100 border-red-400 text-red-800"
                      } else {
                        buttonClass += " bg-gray-100 border-gray-300 text-gray-600"
                      }
                    } else {
                      if (selectedAnswer === index) {
                        buttonClass += " bg-amber-100 border-amber-400 text-amber-800"
                      } else {
                        buttonClass +=
                          " bg-white border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                      }
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={buttonClass}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult || timeLeft === 0}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-semibold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showResult && index === currentQuestion.correct && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {showResult && (
              <div className="text-center space-y-4">
                {helpUsed && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        You used help to advance – 10 credits deducted
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`p-4 rounded-lg ${
                    selectedAnswer === currentQuestion.correct || helpUsed
                      ? "bg-green-100 border border-green-300"
                      : "bg-red-100 border border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {selectedAnswer === currentQuestion.correct || helpUsed ? (
                      <>
                        <Trophy className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          {helpUsed ? "Helped to Success!" : "Excellent Answer!"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Coffee className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-red-800">Not quite right...</span>
                      </>
                    )}
                  </div>
                  {selectedAnswer !== currentQuestion.correct && !helpUsed && (
                    <p className="text-sm text-gray-700">
                      The correct answer was: <strong>{currentQuestion.options[currentQuestion.correct]}</strong>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8"
                >
                  {quizProgress.currentQuestion >= currentLevelData.questions.length - 1
                    ? currentLevel >= (currentQuestData?.levels.length || 0)
                      ? "Assemble Puzzle"
                      : "Next Level"
                    : "Next Question"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
