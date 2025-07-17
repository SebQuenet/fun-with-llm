export const TEST_RESPONSES = {
  FIRST: "A personalized, gamified language learning platform focused on conversational skills, integrating local dialects and cultural nuances, with real-time feedback from native speakers through video chat.",
  SECOND: "The central feature of the application is the ability to chat with native speakers in real-time, with a focus on conversational skills and cultural nuances."
} as const;

export const EXPECTED_PROMPTS = {
  FIRST_CONTAINS: [
    'most promising idea in edTech b2c',
    '2025 in France'
  ],
  SECOND_CONTAINS: [
    'A personalized, gamified language learning platform',
    'Give me details on the central feature'
  ]
} as const;

export const EXPECTED_CALL_COUNT = 2;