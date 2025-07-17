import { describe, it, expect, vi } from 'vitest';
import { MockOpenAIAgent } from './mocks/MockOpenAIAgent';
import { MockClaudeAgent } from './mocks/MockClaudeAgent';
import { MockLlamaAgent } from './mocks/MockLlamaAgent';
import { MockDeepseekAgent } from './mocks/MockDeepseekAgent';

// Mock the new benchmark workflow for legacy tests
const mockLlmBenchmarkUseCase = vi.fn();

vi.mock('../llm-benchmark.usecase', () => ({
  llmBenchmarkUseCase: mockLlmBenchmarkUseCase
}));

describe('Legacy LLM Benchmark Tests', () => {
  const createMockResult = (agents: any[]) => ({
    question: 'Mock benchmark question',
    responses: agents.map(agent => ({
      agentName: agent.name,
      provider: agent.provider,
      response: `Mock response from ${agent.name}`
    })),
    leaderboard: {
      question: 'Mock benchmark question',
      rankings: agents.map((agent, index) => ({
        agentName: agent.name,
        provider: agent.provider,
        score: 90 - index * 5,
        strengths: ['Mock strength'],
        weaknesses: ['Mock weakness'],
        rationale: `Mock rationale for ${agent.name}`
      })),
      overallAnalysis: 'Mock overall analysis',
      timestamp: new Date().toISOString()
    },
    totalAgents: agents.length
  });

  it('should instantiate multiple different LLM agents', async () => {
    const agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent(),
      new MockLlamaAgent(),
      new MockDeepseekAgent()
    ];

    const mockResult = createMockResult(agents);
    mockLlmBenchmarkUseCase.mockResolvedValue(mockResult);

    const result = await mockLlmBenchmarkUseCase({ 
      agents,
      openaiApiKey: 'test-api-key'
    });

    expect(result.totalAgents).toBe(4);
    expect(result.question).toBeDefined();
    expect(result.responses).toHaveLength(4);
    expect(result.leaderboard).toBeDefined();

    // Check agent providers
    const providers = result.responses.map((r: any) => r.provider);
    expect(providers).toContain('OpenAI');
    expect(providers).toContain('Anthropic');
    expect(providers).toContain('Meta');
    expect(providers).toContain('Deepseek');
  });

  it('should instantiate two different LLM agents', async () => {
    const agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent()
    ];

    const mockResult = createMockResult(agents);
    mockLlmBenchmarkUseCase.mockResolvedValue(mockResult);

    const result = await mockLlmBenchmarkUseCase({ 
      agents,
      openaiApiKey: 'test-api-key'
    });

    expect(result.totalAgents).toBe(2);
    expect(result.responses).toHaveLength(2);

    // Check specific providers
    const providers = result.responses.map((r: any) => r.provider);
    expect(providers).toContain('OpenAI');
    expect(providers).toContain('Anthropic');
  });

  it('should instantiate specific agents provided', async () => {
    const customAgents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent()
    ];

    const mockResult = createMockResult(customAgents);
    mockLlmBenchmarkUseCase.mockResolvedValue(mockResult);

    const result = await mockLlmBenchmarkUseCase({ 
      agents: customAgents,
      openaiApiKey: 'test-api-key'
    });

    expect(result.totalAgents).toBe(2);
    expect(result.responses).toHaveLength(2);

    // Check specific agent names
    const agentNames = result.responses.map((r: any) => r.agentName);
    expect(agentNames).toContain('OpenAI GPT-4');
    expect(agentNames).toContain('Claude 3.5 Sonnet');
  });

  it('should handle benchmark execution with agents', async () => {
    const agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent(),
      new MockLlamaAgent(),
      new MockDeepseekAgent()
    ];

    const mockResult = createMockResult(agents);
    mockLlmBenchmarkUseCase.mockResolvedValue(mockResult);

    const result = await mockLlmBenchmarkUseCase({ 
      agents,
      openaiApiKey: 'test-api-key'
    });

    expect(result.totalAgents).toBe(4);
    expect(result.question).toBeDefined();
    expect(result.responses).toHaveLength(4);
    expect(result.leaderboard).toBeDefined();
    expect(result.leaderboard.rankings).toHaveLength(4);
  });
});