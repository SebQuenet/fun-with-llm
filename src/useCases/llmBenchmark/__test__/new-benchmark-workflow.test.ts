import { describe, it, expect, beforeEach, vi } from 'vitest';
import { llmBenchmarkUseCase } from '../llm-benchmark.usecase';
import { QuestionGenerator } from '../services/QuestionGenerator';
import { ResponseJudge } from '../services/ResponseJudge';
import { MockOpenAIAgent } from './mocks/MockOpenAIAgent';
import { MockClaudeAgent } from './mocks/MockClaudeAgent';
import { MockLlamaAgent } from './mocks/MockLlamaAgent';
import { MockDeepseekAgent } from './mocks/MockDeepseekAgent';

// Mock the services
vi.mock('../services/QuestionGenerator');
vi.mock('../services/ResponseJudge');

describe('New Benchmark Workflow', () => {
  let agents: any[];
  let mockQuestionGenerator: any;
  let mockResponseJudge: any;

  beforeEach(() => {
    agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent(),
      new MockLlamaAgent(),
      new MockDeepseekAgent()
    ];

    // Mock QuestionGenerator
    mockQuestionGenerator = {
      generateBenchmarkQuestion: vi.fn().mockResolvedValue(
        'What are the ethical implications and practical challenges of implementing artificial general intelligence in healthcare decision-making systems, and how would you design a framework that balances AI autonomy with human oversight while ensuring equitable access across diverse populations?'
      )
    };
    (QuestionGenerator as any).mockImplementation(() => mockQuestionGenerator);

    // Mock ResponseJudge
    mockResponseJudge = {
      judgeResponses: vi.fn().mockResolvedValue({
        question: 'Mock benchmark question',
        rankings: [
          {
            agentName: 'Claude 3.5 Sonnet',
            provider: 'Anthropic',
            score: 95,
            strengths: ['Comprehensive ethical analysis', 'Well-structured framework', 'Balanced perspective'],
            weaknesses: ['Could explore more technical details'],
            rationale: 'Excellent comprehensive response with strong ethical reasoning'
          },
          {
            agentName: 'OpenAI GPT-4',
            provider: 'OpenAI',
            score: 90,
            strengths: ['Technical depth', 'Practical examples', 'Clear implementation steps'],
            weaknesses: ['Less focus on equity considerations', 'Some repetition'],
            rationale: 'Strong technical analysis with good practical insights'
          },
          {
            agentName: 'Llama 3.2',
            provider: 'Meta',
            score: 85,
            strengths: ['Creative solutions', 'Novel frameworks', 'Good structure'],
            weaknesses: ['Less detailed implementation', 'Some accuracy issues'],
            rationale: 'Creative approach but lacks some depth in critical areas'
          },
          {
            agentName: 'Deepseek V3',
            provider: 'Deepseek',
            score: 80,
            strengths: ['Detailed technical analysis', 'Good coverage of challenges'],
            weaknesses: ['Less creative solutions', 'Somewhat verbose'],
            rationale: 'Solid technical response but could be more innovative'
          }
        ],
        overallAnalysis: 'All models demonstrated strong capabilities with varying strengths in ethical reasoning, technical depth, and creative problem-solving.',
        timestamp: '2024-01-01T00:00:00.000Z'
      })
    };
    (ResponseJudge as any).mockImplementation(() => mockResponseJudge);

    // Mock console.log to reduce noise during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Complete Benchmark Workflow', () => {
    it('should execute the complete benchmarking workflow', async () => {
      const result = await llmBenchmarkUseCase({ 
        agents, 
        openaiApiKey: 'test-api-key' 
      });

      // Verify question generation was called
      expect(mockQuestionGenerator.generateBenchmarkQuestion).toHaveBeenCalledOnce();

      // Verify all agents were called with the analysis prompt
      expect(result.responses).toHaveLength(4);
      expect(result.totalAgents).toBe(4);

      // Verify response judging was called
      expect(mockResponseJudge.judgeResponses).toHaveBeenCalledOnce();

      // Verify result structure
      expect(result.question).toBeDefined();
      expect(result.leaderboard).toBeDefined();
      expect(result.leaderboard.rankings).toHaveLength(4);
      expect(result.leaderboard.overallAnalysis).toBeDefined();
    });

    it('should handle question generation correctly', async () => {
      const questionGenerator = new QuestionGenerator('test-key');
      const question = await questionGenerator.generateBenchmarkQuestion();

      expect(question).toBe(
        'What are the ethical implications and practical challenges of implementing artificial general intelligence in healthcare decision-making systems, and how would you design a framework that balances AI autonomy with human oversight while ensuring equitable access across diverse populations?'
      );
    });

    it('should collect responses from all agents', async () => {
      const result = await llmBenchmarkUseCase({ 
        agents, 
        openaiApiKey: 'test-api-key' 
      });

      // Verify all agents provided responses
      expect(result.responses).toHaveLength(4);

      // Verify response structure
      result.responses.forEach(response => {
        expect(response.agentName).toBeDefined();
        expect(response.provider).toBeDefined();
        expect(response.response).toBeDefined();
        expect(typeof response.response).toBe('string');
      });

      // Verify agent names are correct
      const agentNames = result.responses.map(r => r.agentName);
      expect(agentNames).toContain('OpenAI GPT-4');
      expect(agentNames).toContain('Claude 3.5 Sonnet');
      expect(agentNames).toContain('Llama 3.2');
      expect(agentNames).toContain('Deepseek V3');
    });

    it('should generate proper leaderboard with rankings', async () => {
      const result = await llmBenchmarkUseCase({ 
        agents, 
        openaiApiKey: 'test-api-key' 
      });

      const { leaderboard } = result;

      // Verify leaderboard structure
      expect(leaderboard.question).toBeDefined();
      expect(leaderboard.rankings).toHaveLength(4);
      expect(leaderboard.overallAnalysis).toBeDefined();
      expect(leaderboard.timestamp).toBeDefined();

      // Verify rankings are properly ordered by score
      const scores = leaderboard.rankings.map(r => r.score);
      const sortedScores = [...scores].sort((a, b) => b - a);
      expect(scores).toEqual(sortedScores);

      // Verify each ranking has required fields
      leaderboard.rankings.forEach(ranking => {
        expect(ranking.agentName).toBeDefined();
        expect(ranking.provider).toBeDefined();
        expect(ranking.score).toBeGreaterThanOrEqual(0);
        expect(ranking.score).toBeLessThanOrEqual(100);
        expect(Array.isArray(ranking.strengths)).toBe(true);
        expect(Array.isArray(ranking.weaknesses)).toBe(true);
        expect(ranking.rationale).toBeDefined();
      });
    });

    it('should handle API key configuration', async () => {
      const customApiKey = 'custom-openai-key';
      
      await llmBenchmarkUseCase({ 
        agents, 
        openaiApiKey: customApiKey 
      });

      // Verify services were created with the custom API key
      expect(QuestionGenerator).toHaveBeenCalledWith(customApiKey);
      expect(ResponseJudge).toHaveBeenCalledWith(customApiKey);
    });

    it('should work without explicit API key (using environment)', async () => {
      vi.stubEnv('OPENAI_API_KEY', 'env-api-key');

      await llmBenchmarkUseCase({ agents });

      // Verify services were created without explicit key
      expect(QuestionGenerator).toHaveBeenCalledWith(undefined);
      expect(ResponseJudge).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Error Handling', () => {
    it('should handle agent response failures gracefully', async () => {
      // Create an agent that throws an error
      const failingAgent = {
        name: 'Failing Agent',
        provider: 'Test',
        call: vi.fn().mockRejectedValue(new Error('API Error'))
      };

      const agentsWithFailure = [...agents, failingAgent];

      const result = await llmBenchmarkUseCase({ 
        agents: agentsWithFailure,
        openaiApiKey: 'test-key' 
      });

      // Should still complete with successful agents
      expect(result.responses).toHaveLength(4); // Only successful responses
      expect(result.totalAgents).toBe(5); // Total includes failing agent
    });

    it('should handle question generation failure', async () => {
      mockQuestionGenerator.generateBenchmarkQuestion.mockRejectedValue(
        new Error('Question generation failed')
      );

      await expect(
        llmBenchmarkUseCase({ agents, openaiApiKey: 'test-key' })
      ).rejects.toThrow('Question generation failed');
    });

    it('should handle judgment failure', async () => {
      mockResponseJudge.judgeResponses.mockRejectedValue(
        new Error('Judgment failed')
      );

      await expect(
        llmBenchmarkUseCase({ agents, openaiApiKey: 'test-key' })
      ).rejects.toThrow('Judgment failed');
    });
  });

  describe('Service Integration', () => {
    it('should pass correct parameters to QuestionGenerator', async () => {
      const apiKey = 'test-openai-key';
      
      await llmBenchmarkUseCase({ agents, openaiApiKey: apiKey });

      expect(QuestionGenerator).toHaveBeenCalledWith(apiKey);
      expect(mockQuestionGenerator.generateBenchmarkQuestion).toHaveBeenCalledOnce();
    });

    it('should pass correct parameters to ResponseJudge', async () => {
      const apiKey = 'test-openai-key';
      
      await llmBenchmarkUseCase({ agents, openaiApiKey: apiKey });

      expect(ResponseJudge).toHaveBeenCalledWith(apiKey);
      expect(mockResponseJudge.judgeResponses).toHaveBeenCalledWith(
        expect.any(String), // question
        expect.arrayContaining([
          expect.objectContaining({
            agentName: expect.any(String),
            provider: expect.any(String),
            response: expect.any(String)
          })
        ])
      );
    });

    it('should enhance prompts with analysis instructions', async () => {
      // Create a spy agent to track calls
      const spyAgent = {
        name: 'Spy Agent',
        provider: 'Test',
        call: vi.fn().mockResolvedValue('Spy response to analysis prompt')
      };

      await llmBenchmarkUseCase({ 
        agents: [spyAgent], 
        openaiApiKey: 'test-key' 
      });

      // Verify the agent was called with enhanced prompt
      expect(spyAgent.call).toHaveBeenCalledOnce();
      const callArgs = spyAgent.call.mock.calls[0][0];
      
      expect(callArgs).toContain('complete analysis of this question');
      expect(callArgs).toContain('most advanced answer you are able to provide');
      expect(callArgs).toContain('Deep analytical thinking and reasoning');
      expect(callArgs).toContain('Creative problem-solving approaches');
      expect(callArgs).toContain('ethical implications and trade-offs');
    });
  });
});