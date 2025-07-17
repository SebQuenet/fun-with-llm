import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentFactory, type AgentConfig } from '../agents/AgentFactory';
import { OpenAIAgent } from '../agents/OpenAIAgent';
import { ClaudeAgent } from '../agents/ClaudeAgent';
import { LlamaAgent } from '../agents/LlamaAgent';
import { DeepseekAgent } from '../agents/DeepseekAgent';

// Mock environment variables
const mockEnv = {
  OPENAI_API_KEY: 'mock-openai-key',
  ANTHROPIC_API_KEY: 'mock-anthropic-key',
  TOGETHER_API_KEY: 'mock-together-key',
  DEEPSEEK_API_KEY: 'mock-deepseek-key',
};

beforeEach(() => {
  // Reset environment variables before each test
  Object.keys(mockEnv).forEach(key => {
    vi.stubEnv(key, mockEnv[key as keyof typeof mockEnv]);
  });
});

describe('AgentFactory', () => {
  describe('createAgent', () => {
    it('should create OpenAI agent with default model', () => {
      const config: AgentConfig = { type: 'openai' };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(OpenAIAgent);
      expect(agent.provider).toBe('OpenAI');
      expect(agent.name).toContain('OpenAI');
    });

    it('should create OpenAI agent with custom model', () => {
      const config: AgentConfig = { type: 'openai', model: 'gpt-4' };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(OpenAIAgent);
      expect(agent.name).toBe('OpenAI gpt-4');
    });

    it('should create Claude agent with default model', () => {
      const config: AgentConfig = { type: 'claude' };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(ClaudeAgent);
      expect(agent.provider).toBe('Anthropic');
      expect(agent.name).toContain('Claude');
    });

    it('should create Claude agent with custom model', () => {
      const config: AgentConfig = { type: 'claude', model: 'claude-3-opus' };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(ClaudeAgent);
      expect(agent.name).toBe('Claude claude-3-opus');
    });

    it('should create Llama agent with default model', () => {
      const config: AgentConfig = { type: 'llama' };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(LlamaAgent);
      expect(agent.provider).toBe('Meta');
      expect(agent.name).toContain('Llama');
    });

    it('should create Llama agent with custom model and baseUrl', () => {
      const config: AgentConfig = { 
        type: 'llama', 
        model: 'llama-3.1-70b',
        baseUrl: 'https://custom.api.endpoint'
      };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(LlamaAgent);
      expect(agent.name).toBe('Llama llama-3.1-70b');
    });

    it('should create Deepseek agent with default model', () => {
      const config: AgentConfig = { type: 'deepseek' };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(DeepseekAgent);
      expect(agent.provider).toBe('Deepseek');
      expect(agent.name).toContain('Deepseek');
    });

    it('should create Deepseek agent with custom model', () => {
      const config: AgentConfig = { type: 'deepseek', model: 'deepseek-v2' };
      const agent = AgentFactory.createAgent(config);

      expect(agent).toBeInstanceOf(DeepseekAgent);
      expect(agent.name).toBe('Deepseek deepseek-v2');
    });

    it('should pass custom API key to agents', () => {
      const customKey = 'custom-api-key';
      const config: AgentConfig = { type: 'openai', apiKey: customKey };
      
      // This test verifies the API key is passed, though we can't directly inspect it
      // due to private properties. The agent creation should succeed.
      expect(() => AgentFactory.createAgent(config)).not.toThrow();
    });

    it('should throw error for unsupported agent type', () => {
      const config = { type: 'unsupported' } as AgentConfig;
      
      expect(() => AgentFactory.createAgent(config)).toThrow('Unsupported agent type: unsupported');
    });
  });

  describe('createMultipleAgents', () => {
    it('should create multiple agents from configs', () => {
      const configs: AgentConfig[] = [
        { type: 'openai', model: 'gpt-4' },
        { type: 'claude', model: 'claude-3-5-sonnet-20241022' },
        { type: 'llama', model: 'llama-3.2-90b-text-preview' }
      ];

      const agents = AgentFactory.createMultipleAgents(configs);

      expect(agents).toHaveLength(3);
      expect(agents[0]).toBeInstanceOf(OpenAIAgent);
      expect(agents[1]).toBeInstanceOf(ClaudeAgent);
      expect(agents[2]).toBeInstanceOf(LlamaAgent);
      
      expect(agents[0].name).toBe('OpenAI gpt-4');
      expect(agents[1].name).toBe('Claude claude-3-5-sonnet-20241022');
      expect(agents[2].name).toBe('Llama llama-3.2-90b-text-preview');
    });

    it('should handle empty configs array', () => {
      const configs: AgentConfig[] = [];
      const agents = AgentFactory.createMultipleAgents(configs);

      expect(agents).toHaveLength(0);
      expect(agents).toEqual([]);
    });

    it('should create agents with mixed custom configurations', () => {
      const configs: AgentConfig[] = [
        { type: 'openai', model: 'gpt-4', apiKey: 'custom-openai-key' },
        { type: 'llama', model: 'llama-3.1-70b', baseUrl: 'https://custom.endpoint' },
        { type: 'deepseek' } // Default configuration
      ];

      const agents = AgentFactory.createMultipleAgents(configs);

      expect(agents).toHaveLength(3);
      expect(agents[0].name).toBe('OpenAI gpt-4');
      expect(agents[1].name).toBe('Llama llama-3.1-70b');
      expect(agents[2]).toBeInstanceOf(DeepseekAgent);
    });
  });

  describe('createStandardBenchmarkAgents', () => {
    it('should create all four standard benchmark agents', () => {
      const agents = AgentFactory.createStandardBenchmarkAgents();

      expect(agents).toHaveLength(4);
      
      // Verify all agent types are present
      const agentTypes = agents.map(agent => agent.constructor.name);
      expect(agentTypes).toContain('OpenAIAgent');
      expect(agentTypes).toContain('ClaudeAgent');
      expect(agentTypes).toContain('LlamaAgent');
      expect(agentTypes).toContain('DeepseekAgent');
    });

    it('should create agents with standard models', () => {
      const agents = AgentFactory.createStandardBenchmarkAgents();

      const agentNames = agents.map(agent => agent.name);
      expect(agentNames).toContain('OpenAI gpt-4o-mini');
      expect(agentNames).toContain('Claude claude-3-5-sonnet-20241022');
      expect(agentNames).toContain('Llama llama-3.2-90b-text-preview');
      expect(agentNames).toContain('Deepseek deepseek-chat');
    });

    it('should create agents with correct providers', () => {
      const agents = AgentFactory.createStandardBenchmarkAgents();

      const providers = agents.map(agent => agent.provider);
      expect(providers).toContain('OpenAI');
      expect(providers).toContain('Anthropic');
      expect(providers).toContain('Meta');
      expect(providers).toContain('Deepseek');
    });
  });

  describe('createCustomBenchmarkAgents', () => {
    it('should create agents for specified models only', () => {
      const modelConfigs = {
        openai: 'gpt-4',
        claude: 'claude-3-opus'
      };

      const agents = AgentFactory.createCustomBenchmarkAgents(modelConfigs);

      expect(agents).toHaveLength(2);
      expect(agents[0]).toBeInstanceOf(OpenAIAgent);
      expect(agents[1]).toBeInstanceOf(ClaudeAgent);
      expect(agents[0].name).toBe('OpenAI gpt-4');
      expect(agents[1].name).toBe('Claude claude-3-opus');
    });

    it('should create single agent when only one model specified', () => {
      const modelConfigs = {
        llama: 'llama-3.1-70b'
      };

      const agents = AgentFactory.createCustomBenchmarkAgents(modelConfigs);

      expect(agents).toHaveLength(1);
      expect(agents[0]).toBeInstanceOf(LlamaAgent);
      expect(agents[0].name).toBe('Llama llama-3.1-70b');
    });

    it('should handle all four agents with custom models', () => {
      const modelConfigs = {
        openai: 'gpt-4-turbo',
        claude: 'claude-3-opus',
        llama: 'llama-3.1-405b',
        deepseek: 'deepseek-v2'
      };

      const agents = AgentFactory.createCustomBenchmarkAgents(modelConfigs);

      expect(agents).toHaveLength(4);
      expect(agents[0].name).toBe('OpenAI gpt-4-turbo');
      expect(agents[1].name).toBe('Claude claude-3-opus');
      expect(agents[2].name).toBe('Llama llama-3.1-405b');
      expect(agents[3].name).toBe('Deepseek deepseek-v2');
    });

    it('should return empty array when no models specified', () => {
      const modelConfigs = {};
      const agents = AgentFactory.createCustomBenchmarkAgents(modelConfigs);

      expect(agents).toHaveLength(0);
      expect(agents).toEqual([]);
    });

    it('should skip undefined models', () => {
      const modelConfigs = {
        openai: 'gpt-4',
        claude: undefined,
        llama: 'llama-3.2-90b'
      };

      const agents = AgentFactory.createCustomBenchmarkAgents(modelConfigs);

      expect(agents).toHaveLength(2);
      expect(agents[0].name).toBe('OpenAI gpt-4');
      expect(agents[1].name).toBe('Llama llama-3.2-90b');
    });
  });

  describe('Error Handling', () => {
    it('should propagate agent creation errors', () => {
      // Clear environment variables to trigger errors
      vi.stubEnv('ANTHROPIC_API_KEY', '');
      
      const config: AgentConfig = { type: 'claude' };
      
      expect(() => AgentFactory.createAgent(config)).toThrow('Anthropic API key is required');
    });

    it('should handle errors in multiple agent creation', () => {
      vi.stubEnv('TOGETHER_API_KEY', '');
      
      const configs: AgentConfig[] = [
        { type: 'openai', model: 'gpt-4' },
        { type: 'llama', model: 'llama-3.2-90b' } // This should fail
      ];

      expect(() => AgentFactory.createMultipleAgents(configs)).toThrow();
    });
  });
});