import { OpenAIAgent } from '../agents/OpenAIAgent';

export interface AgentResponse {
  agentName: string;
  provider: string;
  response: string;
}

export interface JudgmentResult {
  agentName: string;
  provider: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  rationale: string;
}

export interface Leaderboard {
  question: string;
  rankings: JudgmentResult[];
  overallAnalysis: string;
  timestamp: string;
}

export class ResponseJudge {
  private openaiAgent: OpenAIAgent;

  constructor(apiKey?: string) {
    this.openaiAgent = new OpenAIAgent('gpt-4o-mini', apiKey);
  }

  async judgeResponses(question: string, responses: AgentResponse[]): Promise<Leaderboard> {
    const prompt = `You are an expert AI evaluator. Analyze and judge the following responses to a benchmark question.

QUESTION:
${question}

RESPONSES TO EVALUATE:
${responses.map((r, i) => `
${i + 1}. ${r.agentName} (${r.provider}):
${r.response}
`).join('\n')}

EVALUATION CRITERIA:
- Accuracy and factual correctness
- Depth of analysis and reasoning
- Creativity and innovation in approach
- Completeness of response
- Clarity and structure
- Practical applicability
- Handling of complexity and nuance
- Evidence of critical thinking

REQUIRED OUTPUT FORMAT (JSON):
{
  "rankings": [
    {
      "agentName": "Agent Name",
      "provider": "Provider",
      "score": 95,
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "weaknesses": ["specific weakness 1", "specific weakness 2"],
      "rationale": "Detailed explanation of why this agent scored this way, highlighting specific aspects of their response"
    }
  ],
  "overallAnalysis": "Summary of key differences between responses, patterns observed, and insights about each model's capabilities"
}

Score each response from 0-100. Rank from highest to lowest score. Be specific and detailed in your analysis. Return only valid JSON.`;

    const judgment = await this.openaiAgent.call(prompt);
    
    try {
      const parsedJudgment = JSON.parse(judgment);
      return {
        question,
        rankings: parsedJudgment.rankings,
        overallAnalysis: parsedJudgment.overallAnalysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to parse judgment response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}