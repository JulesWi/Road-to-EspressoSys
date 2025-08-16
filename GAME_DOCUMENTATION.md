# EspressoSys Quest Game - Technical Documentation

## Overview
An interactive educational game where players progress through quests to learn about EspressoSys technology, meeting bosses and earning NFT composables along the way.

## Game Flow Diagram

\`\`\`
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Welcome   │───▶│ Registration │───▶│  Game Hub   │
│   Screen    │    │    Screen    │    │  (Quests)   │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Meeting    │◀───│     Quiz     │◀───│ Select Quest│
│   Screen    │    │    Screen    │    │   & Level   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │
       ▼                   │ (Auto-advance)
┌─────────────┐           │
│ Completion  │           │
│   Screen    │           ▼
└─────────────┘    ┌─────────────┐
                   │ Next Quiz/  │
                   │   Level     │
                   └─────────────┘
\`\`\`

## Core Components

### 1. Screen Management (`app/page.tsx`)
- **Purpose**: Main router managing screen transitions
- **Screens**: welcome → registration → game → quiz → meeting → complete
- **Features**: Auto-reset on page refresh, clean state management

### 2. Quiz System (`components/quiz-screen.tsx`)
- **Purpose**: Interactive quiz gameplay with educational content
- **Features**:
  - 5-second timer per question
  - Auto-advance after 2-second result display
  - 100% accuracy requirement (wrong answers restart level)
  - Help system (skip questions for credits)
  - Progress tracking and visual feedback

### 3. Game Hub (`components/game-hub.tsx`)
- **Purpose**: Quest selection and progress overview
- **Features**:
  - Quest unlocking system (sequential progression)
  - Level selection within quests
  - Progress visualization
  - Player skill level tracking

### 4. Help System Integration
- **Credits**: Players can use help to skip questions (10 credits each)
- **Limits**: Maximum 9 helps total (3 levels × 3 quizzes each)
- **Penalties**: 5+ helps freeze composables and revoke meeting tickets
- **Tracking**: Visual indicators show help usage and warnings

## Game Mechanics

### Quest Progression
1. **Sequential Unlocking**: Complete Quest N to unlock Quest N+1
2. **Level Structure**: Each quest has 3 levels with multiple questions
3. **100% Requirement**: All questions must be answered correctly
4. **Auto-Advance**: No manual buttons - automatic progression after results

### Help System
- **Availability**: Help option appears when timer expires
- **Cost**: 10 credits per help usage
- **Consequences**: Excessive help usage (5+) freezes rewards
- **Tracking**: Real-time display of help usage (X/9)

### Meeting System
- **Trigger**: Activated after completing all levels in a quest
- **Bosses**: Community Manager, HR, CMO/CTO, CEO
- **Requirements**: Must have valid meeting ticket (not frozen)

## Data Structure

### Player State
\`\`\`typescript
interface Player {
  name: string
  gender: 'male' | 'female'
  domain: string
  currentLevel: number
  completedLevels: CompletedLevel[]
}
\`\`\`

### Quiz Progress
\`\`\`typescript
interface QuizProgress {
  currentQuestion: number
  score: number
  answers: (string | null)[]
}
\`\`\`

### Social State
\`\`\`typescript
interface SocialState {
  helpUsed: number
  canRequestHelp: boolean
  meetingTickets: MeetingTicket[]
}
\`\`\`

## Technical Implementation

### State Management
- **Zustand Store**: Centralized game state management
- **Persistence**: Local storage for game progress
- **Reset Logic**: Clean slate on page refresh

### UI/UX Features
- **Coffee Theme**: Warm brown gradients, cafe backgrounds
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Visual Feedback**: Progress bars, badges, color-coded states
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Performance Optimizations
- **Component Memoization**: Prevent unnecessary re-renders
- **Lazy Loading**: Images and components loaded on demand
- **Efficient Updates**: Minimal state mutations

## Development Guidelines

### Code Organization
- **Components**: Single responsibility, well-documented
- **Hooks**: Custom hooks for complex state logic
- **Types**: Comprehensive TypeScript interfaces
- **Comments**: Detailed JSDoc comments for all functions

### Maintenance
- **Modular Design**: Easy to add new quests/levels
- **Configuration**: Game data separated in `lib/game-state.ts`
- **Error Handling**: Graceful fallbacks for missing data
- **Testing**: Unit tests for critical game logic

## Future Enhancements
- **Multiplayer Features**: Real-time collaboration
- **Advanced Analytics**: Detailed progress tracking
- **Content Management**: Admin interface for quest creation
- **Mobile App**: Native mobile version
- **Blockchain Integration**: True NFT minting and trading
\`\`\`

I've removed all puzzle functionality and implemented auto-advance for quizzes, along with comprehensive code documentation. The game now flows directly from quiz completion to boss meetings, with quizzes automatically advancing after showing results for 2 seconds. All code includes detailed comments explaining functionality, data flow, and maintenance considerations.
