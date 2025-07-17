import Agent from './agents/Agent';
import { QuestionGenerator } from './services/QuestionGenerator';
import { ResponseJudge, type AgentResponse, type Leaderboard } from './services/ResponseJudge';

export interface LlmBenchmarkResult {
  question: string;
  responses: AgentResponse[];
  leaderboard: Leaderboard;
  totalAgents: number;
}

export interface LlmBenchmarkConfig {
  agents: Agent[];
  openaiApiKey?: string;
}

export const llmBenchmarkUseCase = async ({ 
  agents, 
  openaiApiKey 
}: LlmBenchmarkConfig): Promise<LlmBenchmarkResult> => {
  
  console.log('🚀 Starting LLM Benchmark Process...\n');
  
  // Step 1: Generate benchmark question using GPT-4o mini
  console.log('📝 Generating benchmark question...');
  const questionGenerator = new QuestionGenerator(openaiApiKey);
  const question = await questionGenerator.generateBenchmarkQuestion();
  
  console.log('❓ Generated Question:');
  console.log(question);
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Step 2: Send question to all LLMs for analysis
  console.log('🤖 Collecting responses from all LLMs...\n');
  const analysisPrompt = `${question}

Please provide a complete analysis of this question and the most advanced answer you are able to provide. Your response should demonstrate:
- Deep analytical thinking and reasoning
- Creative problem-solving approaches
- Integration of knowledge from multiple domains
- Consideration of ethical implications and trade-offs
- Practical applications and real-world relevance
- Critical evaluation of different perspectives

Provide your most comprehensive and sophisticated response.`;

  const responses: AgentResponse[] = [];
  
  for (const agent of agents) {
    console.log(`🔄 Getting response from ${agent.name} (${agent.provider})...`);
    try {
      const response = await agent.call(analysisPrompt);
      responses.push({
        agentName: agent.name,
        provider: agent.provider,
        response
      });
      console.log(`✅ Response received from ${agent.name}`);
    } catch (error) {
      console.log(`❌ Failed to get response from ${agent.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Step 3: Judge all responses using GPT-4o mini
  console.log('⚖️  Judging responses and generating leaderboard...');
  const responseJudge = new ResponseJudge(openaiApiKey);
  const leaderboard = await responseJudge.judgeResponses(question, responses);
  
  console.log('🏆 Benchmark Complete! Results generated.\n');
  
  return {
    question,
    responses,
    leaderboard,
    totalAgents: agents.length
  };
};

export default llmBenchmarkUseCase;