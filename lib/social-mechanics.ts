export interface PlayerDebt {
  id: string
  creditorId: string
  creditorName: string
  debtorId: string
  debtorName: string
  type: "quiz_help" | "puzzle_help" | "service"
  amount: number
  questId: number
  levelId: number
  dueDate: Date
  isRepaid: boolean
  createdAt: Date
}

export interface HelpRequest {
  id: string
  requesterId: string
  requesterName: string
  type: "quiz_help" | "puzzle_help"
  questId: number
  levelId: number
  questionIndex?: number
  message: string
  isActive: boolean
  createdAt: Date
}

export interface SocialGameState {
  helpUsed: number // Max 3 before season ends
  debts: PlayerDebt[]
  helpRequests: HelpRequest[]
  canRequestHelp: boolean
  lastHelpRequest: Date | null
  meetingTickets: { questId: number; hasTicket: boolean; lostReason?: string }[]
  seasonEnded: boolean
  seasonEndReason?: string
}

export const HELP_COOLDOWN_MINUTES = 30
export const MAX_HELP_USES = 3
export const DEBT_REPAYMENT_DAYS = 7

export const SOCIAL_MESSAGES = {
  DEBT_REMINDER: (creditorName: string, amount: number) =>
    `💰 Tu dois ${amount} points à ${creditorName}. Rembourse vite sinon tu perds ton badge !`,
  HELP_GRANTED: (helperName: string) => `🤝 ${helperName} t'a aidé ! N'oublie pas de rembourser cette faveur.`,
  SEASON_ENDED: (reason: string) => `🚫 Ta saison s'arrête ici : ${reason}`,
  TICKET_LOST: (reason: string) => `🎫 Tu as perdu ton ticket de meeting : ${reason}`,
  MEETING_MISSED: "📅 Tu as manqué le meeting à cause de tes dettes non remboursées !",
}

export function createDebt(
  creditorId: string,
  creditorName: string,
  debtorId: string,
  debtorName: string,
  type: PlayerDebt["type"],
  questId: number,
  levelId: number,
): PlayerDebt {
  return {
    id: `debt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    creditorId,
    creditorName,
    debtorId,
    debtorName,
    type,
    amount: type === "quiz_help" ? 10 : type === "puzzle_help" ? 15 : 5,
    questId,
    levelId,
    dueDate: new Date(Date.now() + DEBT_REPAYMENT_DAYS * 24 * 60 * 60 * 1000),
    isRepaid: false,
    createdAt: new Date(),
  }
}

export function createHelpRequest(
  requesterId: string,
  requesterName: string,
  type: HelpRequest["type"],
  questId: number,
  levelId: number,
  message: string,
  questionIndex?: number,
): HelpRequest {
  return {
    id: `help_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    requesterId,
    requesterName,
    type,
    questId,
    levelId,
    questionIndex,
    message,
    isActive: true,
    createdAt: new Date(),
  }
}
