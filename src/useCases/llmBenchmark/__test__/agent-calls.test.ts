import { describe, it, expect, beforeEach } from 'vitest';
import { MockOpenAIAgent } from './mocks/MockOpenAIAgent';
import { MockClaudeAgent } from './mocks/MockClaudeAgent';
import { MockLlamaAgent } from './mocks/MockLlamaAgent';
import { MockDeepseekAgent } from './mocks/MockDeepseekAgent';
import { llmBenchmarkUseCase } from '../llm-benchmark.usecase';
import Agent from '../agents/Agent';

describe('Agent Call Behavior', () => {
  let agents: Agent[];

  beforeEach(() => {
    agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent(),
      new MockLlamaAgent(),
      new MockDeepseekAgent()
    ];
  });

  describe('Individual Agent Calls', () => {
    it('should handle OpenAI agent calls correctly', async () => {
      const openaiAgent = new MockOpenAIAgent();
      const prompt = 'What is TypeScript?';
      
      const response = await openaiAgent.call(prompt);
      
      expect(response).toBe(`OpenAI response to: ${prompt}`);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should handle Claude agent calls correctly', async () => {
      const claudeAgent = new MockClaudeAgent();
      const prompt = 'Explain machine learning';
      
      const response = await claudeAgent.call(prompt);
      
      expect(response).toBe(`Claude response to: ${prompt}`);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should handle Llama agent calls correctly', async () => {
      const llamaAgent = new MockLlamaAgent();
      const prompt = 'What is artificial intelligence?';
      
      const response = await llamaAgent.call(prompt);
      
      expect(response).toBe(`Llama response to: ${prompt}`);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should handle Deepseek agent calls correctly', async () => {
      const deepseekAgent = new MockDeepseekAgent();
      const prompt = 'How does neural networks work?';
      
      const response = await deepseekAgent.call(prompt);
      
      expect(response).toBe(`Deepseek response to: ${prompt}`);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });
  });

  describe('Response Validation', () => {
    it('should return string responses from all agents', async () => {
      const prompt = 'Test prompt';
      
      for (const agent of agents) {
        const response = await agent.call(prompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
        expect(response).not.toBeNull();
      }
    });

    it('should handle empty prompts', async () => {
      const emptyPrompt = '';
      
      for (const agent of agents) {
        const response = await agent.call(emptyPrompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
      }
    });

    it('should handle long prompts', async () => {
      const longPrompt = 'This is a very long prompt '.repeat(100);
      
      for (const agent of agents) {
        const response = await agent.call(longPrompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
      }
    });

    it('should handle special characters in prompts', async () => {
      const specialPrompt = 'What about émojis 🚀 and symbols @#$%^&*()[]{}?';
      
      for (const agent of agents) {
        const response = await agent.call(specialPrompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
        expect(response).toContain(specialPrompt);
      }
    });

    it('should handle multiline prompts', async () => {
      const multilinePrompt = `Line 1
      Line 2
      Line 3`;
      
      for (const agent of agents) {
        const response = await agent.call(multilinePrompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
      }
    });
  });

  describe('Agent Call Consistency', () => {
    it('should return consistent responses for the same prompt', async () => {
      const prompt = 'Consistent test prompt';
      
      for (const agent of agents) {
        const response1 = await agent.call(prompt);
        const response2 = await agent.call(prompt);
        
        expect(response1).toBe(response2);
      }
    });

    it('should return different responses for different prompts', async () => {
      const prompt1 = 'First prompt';
      const prompt2 = 'Second prompt';
      
      for (const agent of agents) {
        const response1 = await agent.call(prompt1);
        const response2 = await agent.call(prompt2);
        
        expect(response1).not.toBe(response2);
        expect(response1).toContain(prompt1);
        expect(response2).toContain(prompt2);
      }
    });

    it('should maintain agent identity in responses', async () => {
      const prompt = 'Identity test';
      
      const openaiResponse = await agents[0].call(prompt);
      const claudeResponse = await agents[1].call(prompt);
      const llamaResponse = await agents[2].call(prompt);
      const deepseekResponse = await agents[3].call(prompt);
      
      expect(openaiResponse).toContain('OpenAI');
      expect(claudeResponse).toContain('Claude');
      expect(llamaResponse).toContain('Llama');
      expect(deepseekResponse).toContain('Deepseek');
      
      // Ensure all responses are different
      const responses = [openaiResponse, claudeResponse, llamaResponse, deepseekResponse];
      const uniqueResponses = new Set(responses);
      expect(uniqueResponses.size).toBe(4);
    });
  });

  describe('Performance and Timing', () => {
    it('should complete calls within reasonable time', async () => {
      const prompt = 'Performance test';
      const startTime = Date.now();
      
      await Promise.all(agents.map(agent => agent.call(prompt)));
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Mock calls should be very fast (under 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('should handle concurrent calls correctly', async () => {
      const prompts = [
        'Concurrent call 1',
        'Concurrent call 2',
        'Concurrent call 3',
        'Concurrent call 4'
      ];
      
      for (const agent of agents) {
        const responses = await Promise.all(
          prompts.map(prompt => agent.call(prompt))
        );
        
        // All responses should be different and contain their respective prompts
        expect(responses).toHaveLength(4);
        responses.forEach((response, index) => {
          expect(response).toContain(prompts[index]);
        });
      }
    });

    it('should handle sequential calls correctly', async () => {
      const prompt = 'Sequential test';
      
      for (const agent of agents) {
        const responses: string[] = [];
        
        for (let i = 0; i < 3; i++) {
          const response = await agent.call(`${prompt} ${i}`);
          responses.push(response);
        }
        
        expect(responses).toHaveLength(3);
        responses.forEach((response, index) => {
          expect(response).toContain(`${prompt} ${index}`);
        });
      }
    });
  });

  describe('Integration with Use Case', () => {
    it('should work correctly with llmBenchmarkUseCase', async () => {
      const result = await llmBenchmarkUseCase({ agents });
      
      expect(result.agents).toHaveLength(4);
      expect(result.totalAgents).toBe(4);
      
      // Test that agents can be called after use case execution
      for (const agent of result.agents) {
        const response = await agent.call('Integration test');
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
      }
    });

    it('should handle agents in benchmark workflow', async () => {
      const testPrompt = 'Benchmark workflow test';
      const responses: { agent: string; response: string }[] = [];
      
      // Simulate a benchmark workflow
      for (const agent of agents) {
        const response = await agent.call(testPrompt);
        responses.push({
          agent: agent.name,
          response: response
        });
      }
      
      expect(responses).toHaveLength(4);
      
      // Verify each agent responded correctly
      const agentNames = responses.map(r => r.agent);
      expect(agentNames).toContain('OpenAI GPT-4');
      expect(agentNames).toContain('Claude 3.5 Sonnet');
      expect(agentNames).toContain('Llama 3.2');
      expect(agentNames).toContain('Deepseek V3');
      
      // Verify responses are unique
      const uniqueResponses = new Set(responses.map(r => r.response));
      expect(uniqueResponses.size).toBe(4);
    });

    it('should maintain agent state across multiple calls', async () => {
      const prompts = ['First call', 'Second call', 'Third call'];
      
      for (const agent of agents) {
        const responses: string[] = [];
        
        for (const prompt of prompts) {
          const response = await agent.call(prompt);
          responses.push(response);
          
          // Verify agent identity is maintained
          expect(response).toContain(agent.name.split(' ')[0]);
        }
        
        // All responses should be different
        const uniqueResponses = new Set(responses);
        expect(uniqueResponses.size).toBe(3);
      }
    });
  });

  describe('Error Handling in Calls', () => {
    it('should handle null prompts gracefully', async () => {
      for (const agent of agents) {
        // TypeScript will complain about null, but we test runtime behavior
        const response = await agent.call(null as any);
        expect(typeof response).toBe('string');
      }
    });

    it('should handle undefined prompts gracefully', async () => {
      for (const agent of agents) {
        // TypeScript will complain about undefined, but we test runtime behavior
        const response = await agent.call(undefined as any);
        expect(typeof response).toBe('string');
      }
    });

    it('should not throw errors during normal operation', async () => {
      const testPrompts = [
        'Normal prompt',
        '',
        'Very long prompt '.repeat(50),
        'Special chars: !@#$%^&*()',
        '123456789',
        'Mixed content: text + numbers 123 + symbols !@#'
      ];
      
      for (const agent of agents) {
        for (const prompt of testPrompts) {
          await expect(agent.call(prompt)).resolves.toBeDefined();
        }
      }
    });
  });
});