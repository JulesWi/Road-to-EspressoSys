export interface Player {
  id: string
  name: string
  gender: "male" | "female"
  domain: string
  avatar: string
  currentLevel: number
  completedQuests: number[]
  completedLevels: { questId: number; levelId: number }[]
  nftCollected: boolean
}

export interface GameState {
  player: Player | null
  currentScreen: "welcome" | "registration" | "game" | "quiz" | "puzzle" | "meeting" | "complete"
  currentQuest: number
  currentLevel: number
  quizProgress: {
    currentQuestion: number
    score: number
    answers: (string | null)[]
  }
  meetingProgress: {
    currentDialogue: number
    bossLevel: number
  }
}

export const QUEST_THEMES = [
  {
    id: 1,
    title: "Espresso History",
    description: "Discover the origins and evolution of the Espresso Foundation",
    boss: "Community Manager",
    bossAvatar: "/community-manager-avatar.png",
    levels: [
      {
        id: 1,
        title: "The Origins",
        description: "Learn how Espresso was founded and its initial objectives",
        questions: [
          {
            question: "In which year was the Espresso Foundation created?",
            options: ["2020", "2021", "2022", "2023"],
            correct: 1,
          },
          {
            question: "What was Espresso's main objective at its creation?",
            options: ["Create NFTs", "Develop DeFi", "Improve blockchain scalability", "Create games"],
            correct: 2,
          },
          {
            question: "In what context was Espresso created?",
            options: ["2021 Bull market", "Bear market", "After DeFi explosion", "During COVID crisis"],
            correct: 0,
          },
        ],
      },
      {
        id: 2,
        title: "Fundamental Technologies",
        description: "Learn the technical foundations that make Espresso a unique solution",
        questions: [
          {
            question: "What technology does Espresso primarily use?",
            options: ["Proof of Work", "Proof of Stake", "HotShot consensus", "Delegated Proof of Stake"],
            correct: 2,
          },
          {
            question: "What makes HotShot unique?",
            options: ["Faster", "More secure", "Optimistic responsiveness", "Cheaper"],
            correct: 2,
          },
          {
            question: "What type of network is Espresso building?",
            options: ["Layer 1", "Layer 2", "Shared sequencing network", "Sidechain"],
            correct: 2,
          },
        ],
      },
      {
        id: 3,
        title: "Vision and Impact",
        description: "Understand Espresso's impact on the blockchain ecosystem",
        questions: [
          {
            question: "What major problem does Espresso solve?",
            options: ["High fees", "Sequencer centralization", "Slow speed", "Technical complexity"],
            correct: 1,
          },
          {
            question: "How does Espresso improve interoperability?",
            options: ["Bridges", "Shared sequencing", "Atomic swaps", "Cross-chain protocols"],
            correct: 1,
          },
          {
            question: "What is Espresso's long-term vision?",
            options: ["Replace Ethereum", "Unify L2s", "Create new consensus", "Develop dApps"],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Team and Governance",
    description: "Learn about key figures and governance structure",
    boss: "HR Manager",
    bossAvatar: "/hr-manager-avatar.png",
    levels: [
      {
        id: 1,
        title: "Founders and Leadership",
        description: "Discover the visionaries behind Espresso",
        questions: [
          {
            question: "Who is the current CEO of Espresso?",
            options: ["Ben Fisch", "Sreeram Kannan", "Vitalik Buterin", "Gavin Wood"],
            correct: 0,
          },
          {
            question: "What is Ben Fisch's background?",
            options: ["Finance", "Academic research", "Web development", "Marketing"],
            correct: 1,
          },
          {
            question: "How many co-founders does Espresso have?",
            options: ["1", "2", "3", "4"],
            correct: 1,
          },
        ],
      },
      {
        id: 2,
        title: "Organizational Structure",
        description: "Understand how Espresso organizes internally",
        questions: [
          {
            question: "What role does Ben Fisch play at Espresso?",
            options: ["CTO", "CEO and Co-founder", "CMO", "Lead Developer"],
            correct: 1,
          },
          {
            question: "How does Espresso structure its teams?",
            options: ["By product", "By technology", "Research and Engineering", "By region"],
            correct: 2,
          },
          {
            question: "What is Espresso's company culture?",
            options: ["Hierarchical", "Collaborative and open", "Competitive", "Traditional"],
            correct: 1,
          },
        ],
      },
      {
        id: 3,
        title: "Governance and Decisions",
        description: "Explore decision-making mechanisms",
        questions: [
          {
            question: "How does Espresso make strategic decisions?",
            options: ["CEO alone", "Community vote", "Board of directors", "Team consensus"],
            correct: 3,
          },
          {
            question: "What role does the community play in governance?",
            options: ["None", "Advisory", "Decision-making", "Mixed"],
            correct: 2,
          },
          {
            question: "How does Espresso manage transparency?",
            options: ["Closed", "Partially open", "Fully transparent", "On request"],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Ecosystem and Partnerships",
    description: "Explore community initiatives and Espresso partnerships",
    boss: "CMO",
    bossAvatar: "/cmo-executive-avatar.png",
    levels: [
      {
        id: 1,
        title: "Community and Engagement",
        description: "Discover how Espresso engages its community",
        questions: [
          {
            question: "What type of event does Espresso regularly organize?",
            options: ["Hackathons", "Airdrops", "NFT campaigns", "All answers"],
            correct: 3,
          },
          {
            question: "What is Espresso's main communication platform?",
            options: ["Twitter", "Discord", "Telegram", "All answers"],
            correct: 3,
          },
          {
            question: "How does Espresso measure community engagement?",
            options: ["Followers", "Event participation", "Code contributions", "All answers"],
            correct: 3,
          },
        ],
      },
      {
        id: 2,
        title: "Programs and Rewards",
        description: "Learn about different reward programs",
        questions: [
          {
            question: "How does Espresso reward its community?",
            options: ["Tokens only", "NFTs only", "Tokens and NFTs", "No rewards"],
            correct: 2,
          },
          {
            question: "What is the goal of Espresso hackathons?",
            options: ["Marketing", "Innovation", "Recruitment", "All answers"],
            correct: 3,
          },
          {
            question: "How to participate in Espresso programs?",
            options: ["Invitation only", "Open application", "Referral", "Mixed"],
            correct: 1,
          },
        ],
      },
      {
        id: 3,
        title: "Strategic Partnerships",
        description: "Explore Espresso's alliances and collaborations",
        questions: [
          {
            question: "What types of organizations does Espresso partner with?",
            options: ["L2s only", "Universities", "Tech companies", "All answers"],
            correct: 3,
          },
          {
            question: "What is the goal of Espresso's partnerships?",
            options: ["Growth", "Innovation", "Adoption", "All answers"],
            correct: 3,
          },
          {
            question: "How does Espresso choose its partners?",
            options: ["Randomly", "Vision alignment", "Mutual benefit", "B and C"],
            correct: 3,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Innovation and Future",
    description: "Understand Espresso's impact and future vision",
    boss: "CEO",
    bossAvatar: "/ceo-executive-avatar.png",
    levels: [
      {
        id: 1,
        title: "Current Technical Solutions",
        description: "Master Espresso's technical solutions today",
        questions: [
          {
            question: "What is Espresso's main innovation?",
            options: ["Proof of Stake", "Layer 2 Solutions", "Decentralized Sequencing", "Smart Contracts"],
            correct: 2,
          },
          {
            question: "Which networks is Espresso compatible with?",
            options: ["Ethereum only", "Polygon only", "Multiple L2s", "Bitcoin only"],
            correct: 2,
          },
          {
            question: "How does Espresso improve performance?",
            options: ["More validators", "Better consensus", "Network optimizations", "All answers"],
            correct: 3,
          },
        ],
      },
      {
        id: 2,
        title: "Ecosystem Impact",
        description: "Understand Espresso's impact on the blockchain ecosystem",
        questions: [
          {
            question: "What problem does Espresso solve in the blockchain ecosystem?",
            options: ["Scalability", "Security", "Sequencer decentralization", "Interoperability"],
            correct: 2,
          },
          {
            question: "How does Espresso contribute to decentralization?",
            options: ["More nodes", "Shared sequencing", "Open governance", "All answers"],
            correct: 3,
          },
          {
            question: "What is Espresso's economic impact?",
            options: ["Cost reduction", "New models", "Increased efficiency", "All answers"],
            correct: 3,
          },
        ],
      },
      {
        id: 3,
        title: "Future Vision and Roadmap",
        description: "Explore long-term vision and future developments",
        questions: [
          {
            question: "What is Espresso's 2025 vision?",
            options: ["Dominate L2", "Industry standard", "Unified ecosystem", "All answers"],
            correct: 2,
          },
          {
            question: "What are the next planned innovations?",
            options: ["New consensus", "Advanced interoperability", "Developer tools", "All answers"],
            correct: 3,
          },
          {
            question: "How does Espresso see Web3 evolution?",
            options: ["More centralized", "More decentralized", "More accessible", "B and C"],
            correct: 3,
          },
        ],
      },
    ],
  },
]

export const BOSS_DIALOGUES = {
  1: [
    {
      speaker: "Community Manager",
      text: "Congratulations! You excelled in all levels about our history. Your understanding of Espresso's origins, our fundamental technologies, and our vision is remarkable.",
      emotion: "happy",
    },
    {
      speaker: "Community Manager",
      text: "I was particularly impressed by your answers on HotShot and shared sequencing. You really grasp the complex technical challenges!",
      emotion: "impressed",
    },
    {
      speaker: "Community Manager",
      text: "Your progression through the three levels shows real passion for blockchain innovation. Keep it up, you have the perfect profile for our team!",
      emotion: "encouraging",
    },
  ],
  2: [
    {
      speaker: "HR Manager",
      text: "Impressive! Your mastery of our organizational structure, our founders, and our governance demonstrates genuine interest in joining our team.",
      emotion: "impressed",
    },
    {
      speaker: "HR Manager",
      text: "Ben Fisch would be proud to see your deep knowledge of his work and vision. Your understanding of our collaborative culture is exactly what we're looking for!",
      emotion: "proud",
    },
    {
      speaker: "HR Manager",
      text: "With this complete knowledge of our team and processes, you could really be part of our Espresso family. Your profile perfectly matches our values!",
      emotion: "welcoming",
    },
  ],
  3: [
    {
      speaker: "CMO",
      text: "Excellent work! Your understanding of our ecosystem, community programs, and strategic partnerships is exceptional.",
      emotion: "proud",
    },
    {
      speaker: "CMO",
      text: "Your answers about our hackathons, NFT campaigns, and community engagement show you follow all our activities very closely. That's fantastic!",
      emotion: "amazed",
    },
    {
      speaker: "CMO",
      text: "Your marketing vision and understanding of partnerships could really help us develop our ecosystem even further. I'd love to discuss your innovative ideas!",
      emotion: "visionary",
    },
  ],
  4: [
    {
      speaker: "CEO",
      text: "Remarkable! You perfectly master our current technical solutions, our ecosystem impact, and our future vision. Few candidates reach this level of expertise.",
      emotion: "amazed",
    },
    {
      speaker: "CEO",
      text: "Your understanding of decentralized sequencing, interoperability, and our 2025 roadmap demonstrates solid technical and strategic expertise. This is exactly what we need.",
      emotion: "impressed",
    },
    {
      speaker: "CEO",
      text: "After brilliantly navigating all these challenges, I'd now like to hear your ideas for Espresso's future. With your level of understanding, you could bring real added value to our vision!",
      emotion: "curious",
    },
  ],
}
