"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGameState } from "@/hooks/use-game-state"
import { HelpCircle, Users, Clock, AlertTriangle, CreditCard } from "lucide-react"
import { MAX_HELP_USES } from "@/lib/social-mechanics"

interface HelpSystemProps {
  onHelpRequested: (message: string) => void
  canRequestHelp: boolean
  helpUsed: number
  timeLeft?: number
}

export function HelpSystem({ onHelpRequested, canRequestHelp, helpUsed, timeLeft }: HelpSystemProps) {
  const [helpMessage, setHelpMessage] = useState("")
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const { socialState } = useGameState()

  const handleRequestHelp = () => {
    if (helpMessage.trim()) {
      onHelpRequested(helpMessage.trim())
      setHelpMessage("")
      setShowHelpDialog(false)
    }
  }

  const remainingHelp = MAX_HELP_USES - helpUsed
  const isNearLimit = remainingHelp <= 1
  const composableFrozen = helpUsed >= 5

  return (
    <div className="space-y-4">
      {/* Help Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Help System
            </CardTitle>
            <Badge variant={isNearLimit ? "destructive" : "secondary"}>
              {remainingHelp} help{remainingHelp > 1 ? "s" : ""} left
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {composableFrozen && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">Composable frozen! You may miss the meeting.</span>
            </div>
          )}

          {isNearLimit && !composableFrozen && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Warning! Only {remainingHelp} help{remainingHelp > 1 ? "s" : ""} left before composable freezes
              </span>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>Help is available during each quiz when time runs out.</p>
            <p className="mt-1">Each help costs 10 credits and counts toward your total usage.</p>
          </div>

          <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                disabled={!canRequestHelp || remainingHelp === 0}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {!canRequestHelp && timeLeft ? (
                  <>
                    <Clock className="h-4 w-4 mr-1" />
                    Cooldown: {Math.ceil(timeLeft / 60)}min
                  </>
                ) : remainingHelp === 0 ? (
                  "No help available"
                ) : (
                  "Ask for Help"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ask a Colleague for Help</DialogTitle>
                <DialogDescription>
                  A colleague can help you, but you'll need to repay this favor within 7 days.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Explain your problem and ask for help..."
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <CreditCard className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-800">This help will create a debt of 10 points to repay</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRequestHelp} disabled={!helpMessage.trim()}>
                    Send Request
                  </Button>
                  <Button variant="outline" onClick={() => setShowHelpDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Active Debts */}
      {socialState?.debts && socialState.debts.filter((d) => !d.isRepaid).length > 0 && (
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Debts to Repay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {socialState.debts
                .filter((d) => !d.isRepaid)
                .map((debt) => {
                  const isOverdue = new Date() > debt.dueDate
                  return (
                    <div
                      key={debt.id}
                      className={`p-3 rounded-lg border ${
                        isOverdue ? "bg-red-100 border-red-300" : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {debt.amount} points to {debt.creditorName}
                        </span>
                        <Badge variant={isOverdue ? "destructive" : "secondary"}>
                          {isOverdue
                            ? "Overdue"
                            : `${Math.ceil((debt.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))}d left`}
                        </Badge>
                      </div>
                      {isOverdue && <p className="text-xs text-red-600 mt-1">Risk of losing your meeting ticket!</p>}
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
