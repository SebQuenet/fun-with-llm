import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OpenAIAgent } from '../../agents/OpenAIAgent';

// Mock the OpenAI module
vi.mock('openai', () => {
  return {
    OpenAI: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    })),
  };
});

describe('OpenAIAgent', () => {
  beforeEach(() => {
    vi.stubEnv('OPENAI_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create agent with default model', () => {
      const agent = new OpenAIAgent();

      expect(agent.name).toBe('OpenAI gpt-4o-mini');
      expect(agent.provider).toBe('OpenAI');
    });

    it('should create agent with custom model', () => {
      const agent = new OpenAIAgent('gpt-4');

      expect(agent.name).toBe('OpenAI gpt-4');
      expect(agent.provider).toBe('OpenAI');
    });

    it('should create agent with custom API key', () => {
      const customKey = 'custom-api-key';
      const agent = new OpenAIAgent('gpt-4', customKey);

      expect(agent.name).toBe('OpenAI gpt-4');
      expect(agent.provider).toBe('OpenAI');
    });

    it('should use environment variable when no API key provided', () => {
      expect(() => new OpenAIAgent()).not.toThrow();
    });
  });

  describe('call method', () => {
    it('should make successful API call and return response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Test response from OpenAI',
            },
          },
        ],
      };

      const { OpenAI } = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (OpenAI as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const agent = new OpenAIAgent('gpt-4');
      const result = await agent.call('Test prompt');

      expect(result).toBe('Test response from OpenAI');
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Test prompt' }],
        max_tokens: 1000,
        temperature: 0.7,
      });
    });

    it('should handle empty response content', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      };

      const { OpenAI } = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (OpenAI as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const agent = new OpenAIAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });

    it('should handle missing choices in response', async () => {
      const mockResponse = {
        choices: [],
      };

      const { OpenAI } = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (OpenAI as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const agent = new OpenAIAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API request failed');

      const { OpenAI } = await import('openai');
      const mockCreate = vi.fn().mockRejectedValue(mockError);
      (OpenAI as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const agent = new OpenAIAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('OpenAI API error: Error: API request failed');
    });

    it('should use correct model name in API call', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response' } }],
      };

      const { OpenAI } = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (OpenAI as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const agent = new OpenAIAgent('gpt-4-turbo');
      await agent.call('Test prompt');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4-turbo',
        })
      );
    });

    it('should use correct parameters in API call', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response' } }],
      };

      const { OpenAI } = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      (OpenAI as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const agent = new OpenAIAgent();
      await agent.call('Test prompt');

      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Test prompt' }],
        max_tokens: 1000,
        temperature: 0.7,
      });
    });
  });

  describe('Agent Interface Compliance', () => {
    it('should implement Agent interface correctly', () => {
      const agent = new OpenAIAgent();

      expect(typeof agent.name).toBe('string');
      expect(typeof agent.provider).toBe('string');
      expect(typeof agent.call).toBe('function');
      expect(agent.provider).toBe('OpenAI');
    });
  });
});