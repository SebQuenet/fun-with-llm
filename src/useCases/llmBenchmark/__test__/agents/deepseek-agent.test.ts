import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DeepseekAgent } from '../../agents/DeepseekAgent';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('DeepseekAgent', () => {
  beforeEach(() => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'test-api-key');
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create agent with default model', () => {
      const agent = new DeepseekAgent();

      expect(agent.name).toBe('Deepseek deepseek-chat');
      expect(agent.provider).toBe('Deepseek');
    });

    it('should create agent with custom model', () => {
      const agent = new DeepseekAgent('deepseek-v2');

      expect(agent.name).toBe('Deepseek deepseek-v2');
      expect(agent.provider).toBe('Deepseek');
    });

    it('should create agent with custom API key', () => {
      const customKey = 'custom-api-key';
      const agent = new DeepseekAgent('deepseek-chat', customKey);

      expect(agent.name).toBe('Deepseek deepseek-chat');
      expect(agent.provider).toBe('Deepseek');
    });

    it('should throw error when no API key is provided', () => {
      vi.stubEnv('DEEPSEEK_API_KEY', '');

      expect(() => new DeepseekAgent()).toThrow('Deepseek API key is required. Set DEEPSEEK_API_KEY environment variable.');
    });

    it('should use custom API key when environment variable is missing', () => {
      vi.stubEnv('DEEPSEEK_API_KEY', '');
      const customKey = 'custom-api-key';

      expect(() => new DeepseekAgent('deepseek-chat', customKey)).not.toThrow();
    });
  });

  describe('call method', () => {
    it('should make successful API call and return response', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Test response from Deepseek',
              },
            },
          ],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent('deepseek-chat');
      const result = await agent.call('Test prompt');

      expect(result).toBe('Test response from Deepseek');
      expect(mockFetch).toHaveBeenCalledWith('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: 'Test prompt',
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });
    });

    it('should handle empty response content', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: null,
              },
            },
          ],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });

    it('should handle missing choices in response', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });

    it('should throw error when API returns non-ok status', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Deepseek API error: Error: HTTP error! status: 401');
    });

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('Network error');
      mockFetch.mockRejectedValue(mockError);

      const agent = new DeepseekAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Deepseek API error: Error: Network error');
    });

    it('should use correct model in API call', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Response' } }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent('deepseek-v2');
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/chat/completions',
        expect.objectContaining({
          body: expect.stringContaining('"model":"deepseek-v2"'),
        })
      );
    });

    it('should use custom API key in headers', async () => {
      const customKey = 'custom-deepseek-key';
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Response' } }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent('deepseek-chat', customKey);
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/chat/completions',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${customKey}`,
          }),
        })
      );
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Deepseek API error: Error: Invalid JSON');
    });

    it('should use correct parameters in API call', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Response' } }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent();
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/chat/completions',
        expect.objectContaining({
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: 'Test prompt',
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        })
      );
    });

    it('should handle undefined message content', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {},
            },
          ],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new DeepseekAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });
  });

  describe('Agent Interface Compliance', () => {
    it('should implement Agent interface correctly', () => {
      const agent = new DeepseekAgent();

      expect(typeof agent.name).toBe('string');
      expect(typeof agent.provider).toBe('string');
      expect(typeof agent.call).toBe('function');
      expect(agent.provider).toBe('Deepseek');
    });
  });
});