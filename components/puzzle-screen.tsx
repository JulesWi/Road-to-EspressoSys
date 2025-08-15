"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/hooks/use-game-state"
import { QUEST_THEMES } from "@/lib/game-state"
import { Puzzle, Trophy, Download, Sparkles, RotateCcw, Zap, HelpCircle, AlertTriangle } from "lucide-react"

interface PuzzlePiece {
  id: number
  correctPosition: number
  currentPosition: number | null
  image: string
}

export function PuzzleScreen() {
  const { currentQuest, setCurrentScreen, completeQuest, player } = useGameState()
  const [useHelp] = useState(() => () => false) // Mock implementation for useHelp
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [autoPlacedPieces, setAutoPlacedPieces] = useState<number[]>([])

  const currentQuestData = QUEST_THEMES.find((q) => q.id === currentQuest)

  const getPuzzleSize = () => {
    switch (currentQuest) {
      case 1:
        return 4 // Easy: 2x2 puzzle
      case 2:
        return 6 // Medium: 2x3 puzzle
      case 3:
        return 9 // Hard: 3x3 puzzle
      case 4:
        return 12 // Expert: 3x4 puzzle
      default:
        return 9
    }
  }

  const getGridCols = () => {
    switch (currentQuest) {
      case 1:
        return 2
      case 2:
        return 3
      case 3:
        return 3
      case 4:
        return 3
      default:
        return 3
    }
  }

  const handleAskForHelp = () => {
    if (player && player.credits >= 10) {
      const helpUsed = useHelp(10)

      if (helpUsed) {
        setShowHints(true)

        const unplacedPieces = puzzlePieces.filter((p) => p.currentPosition !== p.correctPosition)
        if (unplacedPieces.length > 0) {
          const randomPiece = unplacedPieces[Math.floor(Math.random() * unplacedPieces.length)]
          setPuzzlePieces((prev) =>
            prev.map((piece) =>
              piece.id === randomPiece.id ? { ...piece, currentPosition: piece.correctPosition } : piece,
            ),
          )
          setAutoPlacedPieces((prev) => [...prev, randomPiece.id])
        }

        setTimeout(() => setShowHints(false), 5000)
      }
    }
  }

  useEffect(() => {
    const puzzleSize = getPuzzleSize()
    const pieces: PuzzlePiece[] = Array.from({ length: puzzleSize }, (_, i) => ({
      id: i,
      correctPosition: i,
      currentPosition: null,
      image: `/images/nft-pieces/piece-${(i % 12) + 1}.png`, // Use expanded NFT piece collection
    }))

    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5)
    setPuzzlePieces(shuffledPieces)
  }, [currentQuest])

  useEffect(() => {
    const completed = puzzlePieces.every((piece) => piece.currentPosition === piece.correctPosition)
    if (completed && puzzlePieces.length > 0 && !isCompleted) {
      setIsCompleted(true)
      setShowSuccess(true)
      completeQuest(currentQuest)

      setTimeout(() => {
        if (player && player.helpUsed >= 5) {
          setCurrentScreen("game-hub")
        } else {
          setCurrentScreen("meeting")
        }
      }, 2000)
    }
  }, [puzzlePieces, currentQuest, completeQuest, isCompleted, player, setCurrentScreen])

  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPiece(pieceId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault()
    if (draggedPiece === null) return

    setPuzzlePieces((prev) => {
      const newPieces = [...prev]
      const draggedPieceIndex = newPieces.findIndex((p) => p.id === draggedPiece)
      const targetPieceIndex = newPieces.findIndex((p) => p.currentPosition === targetPosition)

      if (draggedPieceIndex !== -1) {
        const draggedCurrentPos = newPieces[draggedPieceIndex].currentPosition
        newPieces[draggedPieceIndex].currentPosition = targetPosition

        if (targetPieceIndex !== -1) {
          newPieces[targetPieceIndex].currentPosition = draggedCurrentPos
        }
      }

      return newPieces
    })

    setDraggedPiece(null)
  }

  const handleDropToBank = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedPiece === null) return

    setPuzzlePieces((prev) => {
      const newPieces = [...prev]
      const draggedPieceIndex = newPieces.findIndex((p) => p.id === draggedPiece)
      if (draggedPieceIndex !== -1) {
        newPieces[draggedPieceIndex].currentPosition = null
      }
      return newPieces
    })

    setDraggedPiece(null)
  }

  const resetPuzzle = () => {
    setPuzzlePieces((prev) =>
      prev.map((piece) => ({
        ...piece,
        currentPosition: null,
      })),
    )
    setIsCompleted(false)
    setShowSuccess(false)
  }

  const downloadNFT = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext("2d")

    if (ctx) {
      const gradients = [
        ["#f59e0b", "#d97706"], // Orange for quest 1
        ["#3b82f6", "#1d4ed8"], // Blue for quest 2
        ["#10b981", "#059669"], // Green for quest 3
        ["#8b5cf6", "#7c3aed"], // Purple for quest 4
      ]

      const [color1, color2] = gradients[(currentQuest - 1) % gradients.length]
      const gradient = ctx.createLinearGradient(0, 0, 400, 400)
      gradient.addColorStop(0, color1)
      gradient.addColorStop(1, color2)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 400, 400)

      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(50, 50, 300, 300)

      ctx.fillStyle = "white"
      ctx.font = "bold 28px Arial"
      ctx.textAlign = "center"
      ctx.fillText("ESPRESSO", 200, 140)
      ctx.fillText("COMPOSABLE NFT", 200, 180)
      ctx.fillText(`NIVEAU ${currentQuest}`, 200, 220)

      ctx.font = "18px Arial"
      ctx.fillText(player?.name || "Player", 200, 260)
      ctx.fillText(currentQuestData?.title || "", 200, 285)

      ctx.font = "bold 24px Arial"
      const symbols = ["🏛️", "⚙️", "🌐", "🚀"]
      ctx.fillText(symbols[currentQuest - 1] || "✨", 200, 320)

      const link = document.createElement("a")
      link.download = `espresso-nft-level-${currentQuest}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const placedPieces = puzzlePieces.filter((p) => p.currentPosition !== null)
  const bankPieces = puzzlePieces.filter((p) => p.currentPosition === null)
  const puzzleSize = getPuzzleSize()
  const gridCols = getGridCols()

  const getDifficultyBadge = () => {
    const difficulties = ["Easy", "Medium", "Hard", "Expert"]
    const colors = [
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
    ]

    return (
      <Badge className={colors[currentQuest - 1] || colors[0]}>
        <Zap className="h-3 w-3 mr-1" />
        {difficulties[currentQuest - 1] || "Expert"}
      </Badge>
    )
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundImage: "url(/images/cafe-terrace-1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <Card className="bg-white/95 backdrop-blur-sm border-amber-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Puzzle className="h-8 w-8 text-amber-600" />
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Level {currentQuest}
              </Badge>
              {getDifficultyBadge()}
            </div>
            <CardTitle className="text-2xl font-bold text-amber-900">NFT Composable Assembly</CardTitle>
            <CardDescription className="text-amber-700">
              Assemble the {puzzleSize} pieces to unlock your {currentQuestData?.title} NFT
            </CardDescription>
            {player && player.helpUsed >= 5 && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-2" />
                <p className="text-red-800 text-sm font-medium">
                  Warning: Your meeting pass has been revoked due to excessive help usage!
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Assembly Zone ({gridCols}x{Math.ceil(puzzleSize / gridCols)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`grid gap-2 aspect-square max-w-md mx-auto bg-amber-50 p-4 rounded-lg border-2 border-dashed border-amber-300 ${showHints ? "ring-2 ring-blue-400 ring-opacity-50" : ""}`}
                  style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
                >
                  {Array.from({ length: puzzleSize }, (_, i) => {
                    const piece = placedPieces.find((p) => p.currentPosition === i)
                    const isCorrectPosition = piece && piece.correctPosition === i
                    const isAutoPlaced = piece && autoPlacedPieces.includes(piece.id)

                    return (
                      <div
                        key={i}
                        className={`aspect-square border-2 rounded bg-white flex items-center justify-center relative overflow-hidden transition-all ${
                          showHints && !piece
                            ? "border-blue-400 bg-blue-50"
                            : isCorrectPosition
                              ? "border-green-400"
                              : "border-amber-200"
                        } ${isAutoPlaced ? "ring-2 ring-purple-400" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, i)}
                      >
                        {piece ? (
                          <div
                            className="w-full h-full cursor-move hover:scale-105 transition-transform"
                            draggable
                            onDragStart={(e) => handleDragStart(e, piece.id)}
                          >
                            <img
                              src={piece.image || "/placeholder.svg"}
                              alt={`Piece ${piece.id + 1}`}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div
                            className={`text-lg font-bold opacity-30 ${showHints ? "text-blue-600" : "text-amber-400"}`}
                          >
                            {i + 1}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {isCompleted && (
                  <div className="mt-4 text-center">
                    <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                      <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-bold text-green-800 mb-2">NFT Successfully Assembled!</h3>
                      <p className="text-green-700 text-sm">
                        Your Espresso Composable NFT Level {currentQuest} is now available.
                      </p>
                      {player && player.helpUsed >= 5 && (
                        <p className="text-red-700 text-sm mt-2 font-medium">
                          However, your composable is frozen due to excessive help usage.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={downloadNFT}
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                        disabled={player && player.helpUsed >= 5}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download NFT
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white/95 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-900">Available Pieces</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={resetPuzzle}
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleAskForHelp}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                    disabled={!player || player.credits < 10 || isCompleted}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Help (10 credits)
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="grid grid-cols-3 gap-2 min-h-[200px] bg-amber-50 p-3 rounded-lg border-2 border-dashed border-amber-300"
                  onDragOver={handleDragOver}
                  onDrop={handleDropToBank}
                >
                  {bankPieces.map((piece) => (
                    <div
                      key={piece.id}
                      className="aspect-square rounded flex items-center justify-center cursor-move hover:scale-105 transition-transform overflow-hidden border-2 border-amber-200"
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece.id)}
                    >
                      <img
                        src={piece.image || "/placeholder.svg"}
                        alt={`Piece ${piece.id + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center text-sm text-amber-700">
                  <p>Drag pieces into the assembly zone</p>
                  <p className="mt-1">
                    Progress: {placedPieces.length}/{puzzleSize} pieces placed
                  </p>
                  {showHints && (
                    <p className="mt-2 text-blue-600 font-medium">
                      💡 Hints are active! Blue areas show correct positions.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-amber-200 mt-4">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-amber-900">{currentQuestData?.title}</h3>
                  <p className="text-sm text-amber-700">Boss: {currentQuestData?.boss}</p>
                  <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
