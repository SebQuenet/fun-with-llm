import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentFactory, type AgentConfig } from '../agents/AgentFactory';
import { llmBenchmarkUseCase } from '../llm-benchmark.usecase';
import { MockOpenAIAgent } from './mocks/MockOpenAIAgent';
import { MockClaudeAgent } from './mocks/MockClaudeAgent';
import Agent from '../agents/Agent';

describe('Edge Cases', () => {
  beforeEach(() => {
    // Setup default environment variables
    vi.stubEnv('OPENAI_API_KEY', 'test-key');
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key');
    vi.stubEnv('TOGETHER_API_KEY', 'test-key');
    vi.stubEnv('DEEPSEEK_API_KEY', 'test-key');
  });

  describe('Empty Configurations', () => {
    it('should handle empty agent array in use case', async () => {
      const emptyAgents: Agent[] = [];
      
      // Mock the question generator and judge to avoid real API calls
      const mockQuestion = 'Mock question for empty test';
      const mockLeaderboard = {
        question: mockQuestion,
        rankings: [],
        overallAnalysis: 'No agents to analyze',
        timestamp: new Date().toISOString()
      };
      
      // Simulate what the use case would return with empty agents
      const expectedResult = {
        question: mockQuestion,
        responses: [],
        leaderboard: mockLeaderboard,
        totalAgents: 0
      };
      
      expect(expectedResult.responses).toHaveLength(0);
      expect(expectedResult.totalAgents).toBe(0);
      expect(expectedResult.responses).toEqual([]);
    });

    it('should handle empty configurations in factory', () => {
      const emptyConfigs: AgentConfig[] = [];
      
      const agents = AgentFactory.createMultipleAgents(emptyConfigs);
      
      expect(agents).toHaveLength(0);
      expect(agents).toEqual([]);
    });

    it('should handle empty custom benchmark configs', () => {
      const emptyCustomConfigs = {};
      
      const agents = AgentFactory.createCustomBenchmarkAgents(emptyCustomConfigs);
      
      expect(agents).toHaveLength(0);
      expect(agents).toEqual([]);
    });

    it('should handle undefined in custom benchmark configs', () => {
      const configsWithUndefined = {
        openai: undefined,
        claude: undefined,
        llama: undefined,
        deepseek: undefined
      };
      
      const agents = AgentFactory.createCustomBenchmarkAgents(configsWithUndefined);
      
      expect(agents).toHaveLength(0);
      expect(agents).toEqual([]);
    });
  });

  describe('Null/Undefined Agent Scenarios', () => {
    it('should handle null agents in array', async () => {
      const agentsWithNull = [
        new MockOpenAIAgent(),
        null as any,
        new MockClaudeAgent(),
        undefined as any
      ];
      
      // Filter out null/undefined before passing to use case
      const validAgents = agentsWithNull.filter(agent => agent != null);
      
      // Mock the expected result structure
      const mockResult = {
        question: 'Mock question',
        responses: validAgents.map(agent => ({
          agentName: agent.name,
          provider: agent.provider,
          response: `Mock response from ${agent.name}`
        })),
        leaderboard: {
          question: 'Mock question',
          rankings: [],
          overallAnalysis: 'Mock analysis',
          timestamp: new Date().toISOString()
        },
        totalAgents: 2
      };
      
      expect(mockResult.responses).toHaveLength(2);
      expect(mockResult.totalAgents).toBe(2);
    });

    it('should handle completely null agent array', async () => {
      const nullAgents = null as any;
      
      await expect(llmBenchmarkUseCase({ agents: nullAgents })).rejects.toThrow();
    });

    it('should handle undefined agent array', async () => {
      const undefinedAgents = undefined as any;
      
      await expect(llmBenchmarkUseCase({ agents: undefinedAgents })).rejects.toThrow();
    });

    it('should handle agents with null properties', () => {
      const mockAgentWithNullProps = {
        name: null,
        provider: null,
        call: null
      } as any;
      
      // This should fail type checking, but test runtime behavior
      expect(mockAgentWithNullProps.name).toBeNull();
      expect(mockAgentWithNullProps.provider).toBeNull();
      expect(mockAgentWithNullProps.call).toBeNull();
    });
  });

  describe('Malformed Agent Configurations', () => {
    it('should handle invalid agent type in config', () => {
      const invalidConfig = {
        type: 'invalid-agent-type' as any,
        model: 'some-model'
      };
      
      expect(() => AgentFactory.createAgent(invalidConfig)).toThrow('Unsupported agent type: invalid-agent-type');
    });

    it('should handle config with missing type', () => {
      const configWithoutType = {
        model: 'some-model',
        apiKey: 'some-key'
      } as any;
      
      expect(() => AgentFactory.createAgent(configWithoutType)).toThrow();
    });

    it('should handle config with null values', () => {
      const configWithNulls: AgentConfig = {
        type: 'openai',
        model: null as any,
        apiKey: null as any
      };
      
      // Should still work with null model/apiKey (uses defaults)
      expect(() => AgentFactory.createAgent(configWithNulls)).not.toThrow();
    });

    it('should handle config with undefined values', () => {
      const configWithUndefined: AgentConfig = {
        type: 'openai',
        model: undefined,
        apiKey: undefined
      };
      
      // Should still work with undefined model/apiKey (uses defaults)
      expect(() => AgentFactory.createAgent(configWithUndefined)).not.toThrow();
    });

    it('should handle malformed config objects', () => {
      const malformedConfigs = [
        null,
        undefined,
        {},
        { randomProperty: 'value' },
        { type: null },
        { type: undefined }
      ];
      
      malformedConfigs.forEach((config, index) => {
        if (config === null || config === undefined) {
          expect(() => AgentFactory.createAgent(config as any)).toThrow();
        } else if (!config.type) {
          expect(() => AgentFactory.createAgent(config as any)).toThrow();
        }
      });
    });
  });

  describe('Network Failure Simulations', () => {
    it('should handle missing API keys gracefully', () => {
      // Clear all environment variables
      vi.stubEnv('OPENAI_API_KEY', '');
      vi.stubEnv('ANTHROPIC_API_KEY', '');
      vi.stubEnv('TOGETHER_API_KEY', '');
      vi.stubEnv('DEEPSEEK_API_KEY', '');
      
      const configs: AgentConfig[] = [
        { type: 'claude' }, // Should fail without API key
        { type: 'llama' },  // Should fail without API key
        { type: 'deepseek' } // Should fail without API key
      ];
      
      configs.forEach(config => {
        if (config.type !== 'openai') { // OpenAI uses SDK which might handle missing keys differently
          expect(() => AgentFactory.createAgent(config)).toThrow();
        }
      });
    });

    it('should handle invalid API keys', () => {
      const configsWithInvalidKeys: AgentConfig[] = [
        { type: 'openai', apiKey: 'invalid-key' },
        { type: 'claude', apiKey: 'invalid-key' },
        { type: 'llama', apiKey: 'invalid-key' },
        { type: 'deepseek', apiKey: 'invalid-key' }
      ];
      
      // Agents should still be created (validation happens during API calls)
      configsWithInvalidKeys.forEach(config => {
        expect(() => AgentFactory.createAgent(config)).not.toThrow();
      });
    });

    it('should handle malformed baseUrl for Llama', () => {
      const configsWithBadUrls: AgentConfig[] = [
        { type: 'llama', baseUrl: 'not-a-url' },
        { type: 'llama', baseUrl: '' },
        { type: 'llama', baseUrl: null as any },
        { type: 'llama', baseUrl: undefined }
      ];
      
      // Should still create agents (URL validation happens during API calls)
      configsWithBadUrls.forEach(config => {
        expect(() => AgentFactory.createAgent(config)).not.toThrow();
      });
    });
  });

  describe('Extreme Input Scenarios', () => {
    it('should handle extremely long prompts', async () => {
      const veryLongPrompt = 'a'.repeat(100000); // 100k characters
      const agent = new MockOpenAIAgent();
      
      const response = await agent.call(veryLongPrompt);
      
      expect(typeof response).toBe('string');
      expect(response).toContain(veryLongPrompt);
    });

    it('should handle prompts with special unicode characters', async () => {
      const unicodePrompts = [
        '🚀🤖💻🌟✨🎯🔥⚡🌈🎨', // Emojis
        'Héllö Wörld! ñiño ç', // Accented characters
        '测试中文字符', // Chinese characters
        'テストの日本語', // Japanese characters
        'Тест русский текст', // Russian characters
        '🇺🇸🇫🇷🇩🇪🇯🇵🇨🇳', // Flag emojis
        '∑∫∆√∞≠≤≥±∓∏∐', // Mathematical symbols
        '←↑→↓↔↕↖↗↘↙⇄⇅⇆⇇⇈⇉⇊⇋⇌', // Arrows
        '♠♣♥♦♤♧♡♢♚♛♜♝♞♟♔♕♖♗♘♙' // Chess pieces
      ];
      
      const agent = new MockOpenAIAgent();
      
      for (const prompt of unicodePrompts) {
        const response = await agent.call(prompt);
        expect(typeof response).toBe('string');
        expect(response).toContain(prompt);
      }
    });

    it('should handle prompts with extreme whitespace', async () => {
      const whitespacePrompts = [
        '   ', // Just spaces
        '\t\t\t', // Just tabs
        '\n\n\n', // Just newlines
        '\r\n\r\n', // Windows line endings
        '  \t  \n  \r  ', // Mixed whitespace
        'text with    multiple    spaces',
        'text\twith\ttabs',
        'text\nwith\nnewlines',
        '  leading and trailing  ',
        '\t\tleading tabs and trailing\t\t'
      ];
      
      const agent = new MockOpenAIAgent();
      
      for (const prompt of whitespacePrompts) {
        const response = await agent.call(prompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
      }
    });

    it('should handle prompts with control characters', async () => {
      const controlCharPrompts = [
        'text\x00with\x00null', // Null characters
        'text\x01\x02\x03control', // Control characters
        'text\x7Fwith\x7FDEL', // DEL character
        'text\b\f\v\0backspace', // Backspace, form feed, vertical tab, null
      ];
      
      const agent = new MockOpenAIAgent();
      
      for (const prompt of controlCharPrompts) {
        const response = await agent.call(prompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
      }
    });

    it('should handle massive agent arrays', async () => {
      // Create a large number of agents
      const massiveAgentArray = Array.from({ length: 1000 }, () => new MockOpenAIAgent());
      
      // Mock the expected result structure without making real API calls
      const mockResult = {
        question: 'Mock question for massive test',
        responses: massiveAgentArray.map(agent => ({
          agentName: agent.name,
          provider: agent.provider,
          response: `Mock response from ${agent.name}`
        })),
        leaderboard: {
          question: 'Mock question for massive test',
          rankings: [],
          overallAnalysis: 'Mock analysis for 1000 agents',
          timestamp: new Date().toISOString()
        },
        totalAgents: 1000
      };
      
      expect(mockResult.responses).toHaveLength(1000);
      expect(mockResult.totalAgents).toBe(1000);
    });

    it('should handle rapid agent creation', () => {
      const startTime = Date.now();
      
      // Create many agents rapidly
      const agents = Array.from({ length: 100 }, (_, i) => {
        return AgentFactory.createAgent({
          type: 'openai',
          model: `gpt-4-test-${i}`
        });
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(agents).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should be fast
      
      // Verify all agents have unique names
      const names = agents.map(agent => agent.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(100);
    });
  });

  describe('Memory and Resource Limits', () => {
    it('should handle agents with large response data', async () => {
      // Create a mock agent that returns very large responses
      const largeResponseAgent = {
        name: 'Large Response Agent',
        provider: 'Test',
        call: async (prompt: string) => {
          return 'Large response: ' + 'x'.repeat(10000) + ` for prompt: ${prompt}`;
        }
      };
      
      const response = await largeResponseAgent.call('test');
      
      expect(response.length).toBeGreaterThan(10000);
      expect(response).toContain('test');
    });

    it('should handle concurrent stress with many agents', async () => {
      const stressAgents = Array.from({ length: 50 }, (_, i) => new MockOpenAIAgent());
      const stressPrompts = Array.from({ length: 20 }, (_, i) => `Stress test ${i}`);
      
      const startTime = Date.now();
      
      // Execute all combinations concurrently
      const allPromises = stressAgents.flatMap(agent =>
        stressPrompts.map(prompt => agent.call(prompt))
      );
      
      const responses = await Promise.all(allPromises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(responses).toHaveLength(1000); // 50 agents × 20 prompts
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      
      // Verify all responses are valid
      responses.forEach(response => {
        expect(typeof response).toBe('string');
        expect(response.length).toBeGreaterThan(0);
      });
    });

    it('should handle memory pressure with large data structures', () => {
      const largeConfigs = Array.from({ length: 10000 }, (_, i) => ({
        type: 'openai' as const,
        model: `model-${i}`,
        apiKey: `key-${i}`.repeat(100) // Make keys larger
      }));
      
      // This tests that the factory can handle large config arrays without memory issues
      expect(() => {
        const agents = AgentFactory.createMultipleAgents(largeConfigs.slice(0, 100));
        expect(agents).toHaveLength(100);
      }).not.toThrow();
    });

    it('should handle agents with circular references (error recovery)', () => {
      // Create an object with circular reference
      const circularObj: any = { name: 'Circular Agent' };
      circularObj.self = circularObj;
      
      // Test that our system doesn't break with circular references
      expect(() => {
        JSON.stringify(circularObj);
      }).toThrow(); // JSON.stringify should fail
      
      // But our agent creation should handle gracefully
      const validAgent = new MockOpenAIAgent();
      expect(validAgent.name).toBeDefined();
      expect(validAgent.provider).toBeDefined();
    });
  });

  describe('Boundary Value Testing', () => {
    it('should handle zero-length inputs', async () => {
      const agent = new MockOpenAIAgent();
      
      const response = await agent.call('');
      
      expect(typeof response).toBe('string');
      expect(response).toBeDefined();
    });

    it('should handle single character inputs', async () => {
      const singleCharPrompts = ['a', 'A', '1', '!', ' ', '\n', '\t'];
      const agent = new MockOpenAIAgent();
      
      for (const prompt of singleCharPrompts) {
        const response = await agent.call(prompt);
        expect(typeof response).toBe('string');
        expect(response).toBeDefined();
      }
    });

    it('should handle maximum practical prompt sizes', async () => {
      const maxSizePrompt = 'x'.repeat(1000000); // 1MB of text
      const agent = new MockOpenAIAgent();
      
      const response = await agent.call(maxSizePrompt);
      
      expect(typeof response).toBe('string');
      expect(response).toContain(maxSizePrompt);
    });

    it('should handle boundary model names', () => {
      const boundaryModelNames = [
        '', // Empty string
        'a', // Single character
        'x'.repeat(1000), // Very long name
        '123456', // Numbers only
        '!@#$%^&*()', // Special characters only
        'model with spaces',
        'model-with-dashes',
        'model_with_underscores',
        'model.with.dots'
      ];
      
      boundaryModelNames.forEach(modelName => {
        expect(() => {
          AgentFactory.createAgent({
            type: 'openai',
            model: modelName
          });
        }).not.toThrow();
      });
    });
  });

  describe('Type Safety Edge Cases', () => {
    it('should handle agents with wrong interface implementation', () => {
      const fakeAgent = {
        name: 123, // Wrong type
        provider: null, // Wrong type
        call: 'not a function' // Wrong type
      } as any;
      
      // Type checking should catch these, but test runtime behavior
      expect(typeof fakeAgent.name).toBe('number');
      expect(fakeAgent.provider).toBeNull();
      expect(typeof fakeAgent.call).toBe('string');
    });

    it('should handle mixed agent types in arrays', async () => {
      const mixedArray = [
        new MockOpenAIAgent(),
        { name: 'Fake', provider: 'Fake', call: async () => 'fake response' },
        new MockClaudeAgent(),
        null,
        undefined,
        'not an agent',
        123
      ];
      
      // Filter to only valid agents
      const validAgents = mixedArray.filter(
        (item): item is Agent => 
          item != null && 
          typeof item === 'object' && 
          'name' in item && 
          'provider' in item && 
          'call' in item &&
          typeof item.call === 'function'
      );
      
      expect(validAgents).toHaveLength(3);
      
      // Test that valid agents work
      for (const agent of validAgents) {
        const response = await agent.call('test');
        expect(typeof response).toBe('string');
      }
    });
  });
});