import { describe, it, expect, beforeEach } from 'vitest';
import { MockOpenAIAgent } from './mocks/MockOpenAIAgent';
import { MockClaudeAgent } from './mocks/MockClaudeAgent';
import { MockLlamaAgent } from './mocks/MockLlamaAgent';
import { MockDeepseekAgent } from './mocks/MockDeepseekAgent';
import { llmBenchmarkUseCase } from '../llm-benchmark.usecase';
import Agent from '../agents/Agent';

describe('Benchmarking Scenarios', () => {
  let agents: Agent[];

  beforeEach(() => {
    agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent(),
      new MockLlamaAgent(),
      new MockDeepseekAgent()
    ];
  });

  describe('Common Benchmarking Tasks', () => {
    it('should handle question answering benchmark', async () => {
      const qaPrompts = [
        'What is the capital of France?',
        'Explain quantum computing in simple terms',
        'How do you calculate compound interest?',
        'What are the benefits of renewable energy?'
      ];

      for (const prompt of qaPrompts) {
        const responses = await Promise.all(
          agents.map(async (agent) => ({
            agent: agent.name,
            provider: agent.provider,
            response: await agent.call(prompt)
          }))
        );

        // All agents should respond
        expect(responses).toHaveLength(4);
        
        // Each response should be unique
        const uniqueResponses = new Set(responses.map(r => r.response));
        expect(uniqueResponses.size).toBe(4);
        
        // All responses should contain the prompt
        responses.forEach(({ response }) => {
          expect(response).toContain(prompt);
        });
      }
    });

    it('should handle creative writing benchmark', async () => {
      const creativePrompts = [
        'Write a short story about a robot learning to paint',
        'Create a haiku about artificial intelligence',
        'Describe a futuristic city in 2050',
        'Write a dialogue between two AI systems'
      ];

      for (const prompt of creativePrompts) {
        const responses = await Promise.all(
          agents.map(async (agent) => ({
            agent: agent.name,
            response: await agent.call(prompt),
            timestamp: Date.now()
          }))
        );

        expect(responses).toHaveLength(4);
        
        // Verify each agent provided a unique response
        const responseTexts = responses.map(r => r.response);
        const uniqueResponses = new Set(responseTexts);
        expect(uniqueResponses.size).toBe(4);
        
        // Verify responses are timely (mock responses should be instant)
        const maxTimestamp = Math.max(...responses.map(r => r.timestamp));
        const minTimestamp = Math.min(...responses.map(r => r.timestamp));
        expect(maxTimestamp - minTimestamp).toBeLessThan(100); // Within 100ms
      }
    });

    it('should handle code generation benchmark', async () => {
      const codePrompts = [
        'Write a Python function to sort a list',
        'Create a JavaScript function to validate email',
        'Generate SQL query to find top 10 customers',
        'Write a TypeScript interface for a user object'
      ];

      const results = [];

      for (const prompt of codePrompts) {
        const agentResponses = await Promise.all(
          agents.map(async (agent) => {
            const startTime = Date.now();
            const response = await agent.call(prompt);
            const endTime = Date.now();
            
            return {
              agent: agent.name,
              provider: agent.provider,
              prompt,
              response,
              responseTime: endTime - startTime,
              responseLength: response.length
            };
          })
        );
        
        results.push({
          prompt,
          responses: agentResponses
        });
      }

      // Analyze results
      expect(results).toHaveLength(4);
      
      results.forEach(({ prompt, responses }) => {
        expect(responses).toHaveLength(4);
        
        // All response times should be reasonable (mock = very fast)
        responses.forEach(({ responseTime }) => {
          expect(responseTime).toBeLessThan(50);
        });
        
        // All responses should contain the original prompt
        responses.forEach(({ response }) => {
          expect(response).toContain(prompt);
        });
        
        // Verify provider diversity
        const providers = responses.map(r => r.provider);
        expect(providers).toContain('OpenAI');
        expect(providers).toContain('Anthropic');
        expect(providers).toContain('Meta');
        expect(providers).toContain('Deepseek');
      });
    });

    it('should handle reasoning benchmark', async () => {
      const reasoningPrompts = [
        'If all cats are mammals and all mammals are animals, are cats animals?',
        'A train leaves station A at 2 PM traveling at 60 mph. Another train leaves station B at 3 PM traveling at 80 mph. If the stations are 280 miles apart, when will they meet?',
        'What is the logical fallacy in this statement: "Everyone I know likes pizza, therefore everyone in the world likes pizza"?',
        'If you have 12 balls and one is slightly heavier, how can you find it using a balance scale in just 3 weighings?'
      ];

      const benchmarkResults = {
        totalPrompts: reasoningPrompts.length,
        totalAgents: agents.length,
        results: [] as any[]
      };

      for (const prompt of reasoningPrompts) {
        const responses = await Promise.all(
          agents.map(async (agent, index) => {
            const response = await agent.call(prompt);
            return {
              agentIndex: index,
              agentName: agent.name,
              provider: agent.provider,
              promptLength: prompt.length,
              responseLength: response.length,
              response
            };
          })
        );

        benchmarkResults.results.push({
          prompt,
          responses
        });
      }

      // Validate benchmark results
      expect(benchmarkResults.totalPrompts).toBe(4);
      expect(benchmarkResults.totalAgents).toBe(4);
      expect(benchmarkResults.results).toHaveLength(4);

      // Each prompt should have responses from all agents
      benchmarkResults.results.forEach(({ responses }) => {
        expect(responses).toHaveLength(4);
        
        // Verify agent indices are correct
        const agentIndices = responses.map((r: any) => r.agentIndex);
        expect(agentIndices).toEqual([0, 1, 2, 3]);
        
        // All responses should have content
        responses.forEach((r: any) => {
          expect(r.responseLength).toBeGreaterThan(0);
          expect(r.response).toBeDefined();
        });
      });
    });
  });

  describe('Benchmark Metrics Collection', () => {
    it('should collect response time metrics', async () => {
      const testPrompt = 'Metrics collection test';
      const metrics = [];

      for (const agent of agents) {
        const startTime = performance.now();
        const response = await agent.call(testPrompt);
        const endTime = performance.now();
        
        metrics.push({
          agent: agent.name,
          provider: agent.provider,
          responseTime: endTime - startTime,
          responseLength: response.length,
          wordsPerSecond: response.split(' ').length / ((endTime - startTime) / 1000)
        });
      }

      expect(metrics).toHaveLength(4);
      
      // All metrics should have reasonable values
      metrics.forEach(metric => {
        expect(metric.responseTime).toBeGreaterThan(0);
        expect(metric.responseLength).toBeGreaterThan(0);
        expect(metric.wordsPerSecond).toBeGreaterThan(0);
        expect(Number.isFinite(metric.wordsPerSecond)).toBe(true);
      });

      // Calculate average response time
      const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
      expect(avgResponseTime).toBeLessThan(50); // Mock responses should be very fast
    });

    it('should track success rates across multiple calls', async () => {
      const testPrompts = [
        'Test prompt 1',
        'Test prompt 2',
        'Test prompt 3',
        'Test prompt 4',
        'Test prompt 5'
      ];

      const successTracking = agents.map(agent => ({
        agent: agent.name,
        provider: agent.provider,
        attempts: 0,
        successes: 0,
        failures: 0,
        successRate: 0
      }));

      for (const prompt of testPrompts) {
        for (let i = 0; i < agents.length; i++) {
          const agent = agents[i];
          const tracking = successTracking[i];
          
          tracking.attempts++;
          
          try {
            const response = await agent.call(prompt);
            if (response && response.length > 0) {
              tracking.successes++;
            } else {
              tracking.failures++;
            }
          } catch (error) {
            tracking.failures++;
          }
        }
      }

      // Calculate success rates
      successTracking.forEach(tracking => {
        tracking.successRate = tracking.successes / tracking.attempts;
      });

      // All mock agents should have 100% success rate
      successTracking.forEach(tracking => {
        expect(tracking.attempts).toBe(5);
        expect(tracking.successes).toBe(5);
        expect(tracking.failures).toBe(0);
        expect(tracking.successRate).toBe(1.0);
      });
    });

    it('should compare response quality metrics', async () => {
      const qualityPrompt = 'Explain the concept of machine learning';
      
      const qualityMetrics = await Promise.all(
        agents.map(async (agent) => {
          const response = await agent.call(qualityPrompt);
          
          return {
            agent: agent.name,
            provider: agent.provider,
            responseLength: response.length,
            wordCount: response.split(' ').length,
            sentenceCount: response.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
            avgWordsPerSentence: response.split(' ').length / response.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
            containsPrompt: response.toLowerCase().includes(qualityPrompt.toLowerCase()),
            response
          };
        })
      );

      expect(qualityMetrics).toHaveLength(4);
      
      // All responses should be meaningful
      qualityMetrics.forEach(metric => {
        expect(metric.responseLength).toBeGreaterThan(0);
        expect(metric.wordCount).toBeGreaterThan(0);
        expect(metric.sentenceCount).toBeGreaterThan(0);
        expect(metric.avgWordsPerSentence).toBeGreaterThan(0);
        expect(Number.isFinite(metric.avgWordsPerSentence)).toBe(true);
        expect(metric.containsPrompt).toBe(true);
      });

      // Verify diversity in responses
      const responseLengths = qualityMetrics.map(m => m.responseLength);
      const uniqueLengths = new Set(responseLengths);
      expect(uniqueLengths.size).toBeGreaterThan(1); // Should have some variation
    });
  });

  describe('Stress Testing', () => {
    it('should handle rapid sequential calls', async () => {
      const rapidPrompts = Array.from({ length: 10 }, (_, i) => `Rapid test ${i}`);
      
      for (const agent of agents) {
        const startTime = Date.now();
        
        const responses = [];
        for (const prompt of rapidPrompts) {
          const response = await agent.call(prompt);
          responses.push(response);
        }
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        expect(responses).toHaveLength(10);
        expect(totalTime).toBeLessThan(1000); // Should complete quickly for mocks
        
        // All responses should be unique
        const uniqueResponses = new Set(responses);
        expect(uniqueResponses.size).toBe(10);
      }
    });

    it('should handle concurrent calls to same agent', async () => {
      const concurrentPrompts = Array.from({ length: 5 }, (_, i) => `Concurrent test ${i}`);
      
      for (const agent of agents) {
        const startTime = Date.now();
        
        const responses = await Promise.all(
          concurrentPrompts.map(prompt => agent.call(prompt))
        );
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        expect(responses).toHaveLength(5);
        expect(totalTime).toBeLessThan(500); // Should handle concurrency well
        
        // Verify all responses are correct
        responses.forEach((response, index) => {
          expect(response).toContain(concurrentPrompts[index]);
        });
      }
    });
  });
});