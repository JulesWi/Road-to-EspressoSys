"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/hooks/use-game-state"
import { QUEST_THEMES } from "@/lib/game-state"
import { Coffee, Clock, Trophy, ArrowRight, CheckCircle, BookOpen, AlertTriangle, RotateCcw } from "lucide-react"

/**
 * QuizScreen Component
 *
 * Enhanced quiz interface that handles:
 * - Question display and answer selection with auto-advance
 * - Timer countdown (5 seconds per question)
 * - Help system integration (skip questions for credits based on missed questions)
 * - 100% accuracy requirement (wrong answers restart level)
 * - Option to retry only missed questions instead of full level restart
 * - Progress tracking and comprehensive visual feedback
 * - Credit-based help system with proportional costs
 */
export function QuizScreen() {
  // Game state management hooks
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
    updateMeetingProgress,
    useHelp,
  } = useGameState()

  // Local component state for quiz interaction
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(5) // 5-second timer per question
  const [showHelpOption, setShowHelpOption] = useState(false)
  const [helpUsed, setHelpUsed] = useState(false)
  const [missedQuestions, setMissedQuestions] = useState<number[]>([]) // Track which questions were missed
  const [retryMode, setRetryMode] = useState(false) // Whether we're retrying missed questions only
  const [helpSuccess, setHelpSuccess] = useState(false)
  const [showRetryOptions, setShowRetryOptions] = useState(false)

  // State for help cost calculation
  const [helpCost, setHelpCost] = useState(0)

  // Get current quest and level data from game state
  const currentQuestData = QUEST_THEMES.find((q) => q.id === currentQuest)
  const currentLevelData = currentQuestData?.levels.find((l) => l.id === currentLevel)
  const currentQuestion = currentLevelData?.questions[quizProgress.currentQuestion]

  /**
   * Timer Effect
   * Counts down from 5 seconds, shows help option when time expires
   * Automatically resets when moving to next question
   */
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult && selectedAnswer === null) {
      // Only show help option if no answer was selected and time expired
      setShowHelpOption(true)
    }
  }, [timeLeft, showResult, selectedAnswer])

  /**
   * Question Change Effect
   * Resets all question-specific state when moving to next question
   * Ensures clean state for each new question
   */
  useEffect(() => {
    if (!showHelpOption && !showRetryOptions) {
      setTimeLeft(5)
      setSelectedAnswer(null)
      setShowResult(false)
      setHelpUsed(false)
      setHelpSuccess(false)
      setHelpCost(0)
    }
  }, [quizProgress.currentQuestion, showHelpOption, showRetryOptions])

  /**
   * Auto-advance Effect
   * Automatically moves to next question after showing result for 2 seconds
   * Provides smooth progression without manual button clicks
   */
  useEffect(() => {
    if (showResult && !showHelpOption) {
      const totalQuestions = currentLevelData?.questions.length || 0
      const isLastQuestion = quizProgress.currentQuestion >= totalQuestions - 1
      const hasWrongAnswer = selectedAnswer !== currentQuestion?.correct && selectedAnswer !== null

      // If wrong answer on last question, show retry options immediately
      if (hasWrongAnswer && isLastQuestion) {
        const timer = setTimeout(() => {
          setShowRetryOptions(true)
        }, 2000)
        return () => clearTimeout(timer)
      }

      // Normal progression for correct answers or not last question
      if (!hasWrongAnswer || !isLastQuestion) {
        const autoAdvanceTimer = setTimeout(() => {
          handleNextQuestion()
        }, 2000)
        return () => clearTimeout(autoAdvanceTimer)
      }
    }
  }, [showResult, showHelpOption, selectedAnswer, currentQuestion, quizProgress.currentQuestion])

  /**
   * Handle Answer Selection
   * Processes user's answer choice and updates quiz progress
   * When wrong answer is selected, show retry options immediately
   */
  const handleAnswer = (answerIndex: number | null) => {
    if (showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === currentQuestion?.correct
    const newScore = isCorrect ? quizProgress.score + 1 : quizProgress.score

    if (!isCorrect) {
      setMissedQuestions((prev) => [...prev, quizProgress.currentQuestion])
      // Don't show help options for wrong answers - go straight to retry
      setShowHelpOption(false)
    }

    // Update answer history
    const newAnswers = [...quizProgress.answers]
    newAnswers[quizProgress.currentQuestion] =
      answerIndex !== null ? currentQuestion?.options[answerIndex] || null : null

    updateQuizProgress({
      score: newScore,
      answers: newAnswers,
    })
  }

  /**
   * Handle Help Usage
   * Enhanced help system that costs credits proportional to missed questions
   * Allows player to skip question using credits, tracks help usage
   */
  const handleUseHelpToContinue = () => {
    if (!player || !socialState) return

    const missedCount = missedQuestions.length + 1 // +1 for current question
    const helpCost = Math.min(Math.max(missedCount * 2, 1), 10)
    setHelpCost(helpCost)

    if ((socialState?.helpUsed || 0) + helpCost > 9) return // Not enough credits

    setHelpUsed(true)

    updateQuizProgress({
      currentQuestion: quizProgress.currentQuestion + 1,
      score: quizProgress.score + 1,
    })
    setShowHelpOption(false)
  }

  /**
   * Handle Retry Missed Questions Only
   * New feature: Instead of restarting entire level, only retry missed questions
   */
  const handleRetryMissedOnly = () => {
    if (missedQuestions.length === 0) return

    console.log("[v0] Starting retry mode for missed questions:", missedQuestions)
    setRetryMode(true)
    setShowRetryOptions(false)

    // Start with first missed question
    updateQuizProgress({
      currentQuestion: missedQuestions[0],
      score: quizProgress.score, // Keep correct answers
      answers: quizProgress.answers, // Keep existing answers
    })
    setMissedQuestions(missedQuestions.slice(1)) // Remove first from retry list
  }

  /**
   * Handle Full Level Restart
   * Traditional restart that resets everything to beginning
   */
  const handleFullRestart = () => {
    console.log("[v0] Full level restart")
    setRetryMode(false)
    setMissedQuestions([])
    setShowRetryOptions(false)
    setShowHelpOption(false)

    updateQuizProgress({
      currentQuestion: 0,
      score: 0,
      answers: [],
    })
  }

  /**
   * Handle Next Question/Level Progression
   * Enhanced progression logic with retry mode support
   * Manages advancement through questions, levels, and quests
   */
  const handleNextQuestion = () => {
    const totalQuestions = currentLevelData?.questions.length || 0

    console.log("[v0] handleNextQuestion - Current state:", {
      currentQuest,
      currentLevel,
      currentQuestion: quizProgress.currentQuestion,
      totalQuestions,
      retryMode,
      missedQuestions: missedQuestions.length,
      score: quizProgress.score,
    })

    if (retryMode && missedQuestions.length > 0) {
      updateQuizProgress({
        currentQuestion: missedQuestions[0],
      })
      setMissedQuestions((prev) => prev.slice(1))
      return
    }

    const isLastQuestion = retryMode ? missedQuestions.length === 0 : quizProgress.currentQuestion >= totalQuestions - 1

    if (isLastQuestion) {
      const perfectScore = quizProgress.score === totalQuestions

      console.log("[v0] Level completion check:", { perfectScore, helpUsed, missedQuestions: missedQuestions.length })

      // If not perfect score and no help used, handle retry
      if (!perfectScore && !helpUsed) {
        if (missedQuestions.length > 0) {
          // Don't auto-restart, let retry options handle it
          return
        }
        // If no missed questions tracked but score isn't perfect, restart
        handleFullRestart()
        return
      }

      // Perfect score or help was used - complete the level
      console.log("[v0] Completing level:", currentQuest, currentLevel)
      completeLevel(currentQuest, currentLevel)

      const totalLevelsInQuest = currentQuestData?.levels.length || 3
      const isLastLevelInQuest = currentLevel >= totalLevelsInQuest

      console.log("[v0] Level progression check:", {
        currentLevel,
        totalLevelsInQuest,
        isLastLevelInQuest,
      })

      if (isLastLevelInQuest) {
        updateMeetingProgress({
          currentDialogue: 0,
          bossLevel: currentQuest,
        })
        console.log("[v0] Moving to meeting for quest", currentQuest)
        setCurrentScreen("meeting")
      } else {
        const nextLevel = currentLevel + 1
        console.log("[v0] Moving to next level:", nextLevel)
        setCurrentLevel(nextLevel)

        // Reset everything for new level
        updateQuizProgress({
          currentQuestion: 0,
          score: 0,
          answers: [],
        })

        // Reset all local state
        setRetryMode(false)
        setMissedQuestions([])
        setSelectedAnswer(null)
        setShowResult(false)
        setShowHelpOption(false)
        setShowRetryOptions(false)
        setTimeLeft(5)
      }
    } else {
      // Move to next question
      console.log("[v0] Moving to next question:", quizProgress.currentQuestion + 1)
      updateQuizProgress({
        currentQuestion: quizProgress.currentQuestion + 1,
      })
    }
  }

  // Calculate progress percentage for progress bar
  const progressPercentage = currentLevelData
    ? ((quizProgress.currentQuestion + 1) / currentLevelData.questions.length) * 100
    : 0

  // Error handling for missing data
  if (!currentQuestData || !currentLevelData || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <div className="text-center text-red-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error: Quest or level data not found</p>
              <Button onClick={() => setCurrentScreen("game")} className="mt-4">
                Return to Game Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Quiz Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-amber-200">
          <CardHeader className="text-center space-y-4">
            {/* Header with level info and timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Level {currentQuest}.{currentLevel}
                </Badge>
                <BookOpen className="h-4 w-4 text-amber-600" />
                {retryMode && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    Retry Mode
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-xl font-bold">{timeLeft.toString().padStart(2, "0")}s</span>
              </div>
            </div>

            {/* Quest and level titles */}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-amber-900">{currentLevelData.title}</CardTitle>
              <CardDescription className="text-amber-700">{currentLevelData.description}</CardDescription>
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border-2 border-amber-200">
                Quest: {currentQuestData.title}
              </div>
            </div>

            {/* Enhanced help usage tracking with composable freeze warning */}
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

            {/* 100% requirement notice */}
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-semibold text-sm">100% Success Required</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                You must answer all questions correctly to pass this level. Wrong answers can be retried individually.
              </p>
            </div>

            {/* Progress tracking */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-amber-700">
                <span>
                  Question {quizProgress.currentQuestion + 1} of {currentLevelData.questions.length}
                  {retryMode && ` (${missedQuestions.length + 1} missed remaining)`}
                </span>
                <span>
                  Score: {quizProgress.score}/{currentLevelData.questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Enhanced help option when time expires */}
            {showHelpOption && !showResult && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Time's Up!</span>
                </div>
                <p className="text-sm text-yellow-700 mb-4">
                  You can ask for help to continue, or choose how to restart this level.
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    onClick={handleUseHelpToContinue}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    disabled={(socialState?.helpUsed || 0) + helpCost > 9}
                  >
                    Ask for Help ({helpCost} credits)
                  </Button>
                  {missedQuestions.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleRetryMissedOnly}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retry Missed Only ({missedQuestions.length + 1})
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleFullRestart}
                    className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Level
                  </Button>
                </div>
              </div>
            )}

            {/* Retry Options for Wrong Answers */}
            {showRetryOptions && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">Level Failed - 100% Required</span>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  You need to answer all questions correctly. Choose how to retry:
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {missedQuestions.length > 0 && (
                    <Button
                      onClick={() => {
                        setShowRetryOptions(false)
                        handleRetryMissedOnly()
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retry Missed Only ({missedQuestions.length} questions)
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setShowRetryOptions(false)
                      handleFullRestart()
                    }}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Entire Level
                  </Button>
                </div>
              </div>
            )}

            {/* Question and answer options */}
            {!showHelpOption && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">{currentQuestion.question}</h3>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    // Dynamic styling based on answer state
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

            {/* Enhanced result feedback with credit deduction info */}
            {showResult && !showRetryOptions && (
              <div className="text-center space-y-4">
                {helpUsed && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        You used help to advance – {helpCost} credits deducted
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
                    <p className="text-sm text-gray-700 mb-3">
                      The correct answer was: <strong>{currentQuestion.options[currentQuestion.correct]}</strong>
                    </p>
                  )}
                </div>

                {/* Only show continue options for correct answers or when not on last question */}
                {(selectedAnswer === currentQuestion.correct ||
                  helpUsed ||
                  (selectedAnswer !== currentQuestion.correct &&
                    quizProgress.currentQuestion < (currentLevelData?.questions.length || 0) - 1)) && (
                  <div className="flex flex-col gap-3 items-center">
                    <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border">
                      <ArrowRight className="h-4 w-4 inline mr-1" />
                      Auto-advancing in 2 seconds...
                    </div>

                    <Button
                      onClick={handleNextQuestion}
                      variant="outline"
                      size="sm"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                    >
                      Continue Now
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
