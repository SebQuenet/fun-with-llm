import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LlamaAgent } from '../../agents/LlamaAgent';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('LlamaAgent', () => {
  beforeEach(() => {
    vi.stubEnv('TOGETHER_API_KEY', 'test-api-key');
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create agent with default model and baseUrl', () => {
      const agent = new LlamaAgent();

      expect(agent.name).toBe('Llama llama-3.2-90b-text-preview');
      expect(agent.provider).toBe('Meta');
    });

    it('should create agent with custom model', () => {
      const agent = new LlamaAgent('llama-3.1-70b');

      expect(agent.name).toBe('Llama llama-3.1-70b');
      expect(agent.provider).toBe('Meta');
    });

    it('should create agent with custom API key', () => {
      const customKey = 'custom-api-key';
      const agent = new LlamaAgent('llama-3.2-90b-text-preview', customKey);

      expect(agent.name).toBe('Llama llama-3.2-90b-text-preview');
      expect(agent.provider).toBe('Meta');
    });

    it('should create agent with custom baseUrl', () => {
      const customBaseUrl = 'https://custom.api.endpoint';
      const agent = new LlamaAgent('llama-3.1-70b', 'test-key', customBaseUrl);

      expect(agent.name).toBe('Llama llama-3.1-70b');
      expect(agent.provider).toBe('Meta');
    });

    it('should throw error when no API key is provided', () => {
      vi.stubEnv('TOGETHER_API_KEY', '');

      expect(() => new LlamaAgent()).toThrow('Together API key is required for Llama. Set TOGETHER_API_KEY environment variable.');
    });

    it('should use custom API key when environment variable is missing', () => {
      vi.stubEnv('TOGETHER_API_KEY', '');
      const customKey = 'custom-api-key';

      expect(() => new LlamaAgent('llama-3.2-90b-text-preview', customKey)).not.toThrow();
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
                content: 'Test response from Llama',
              },
            },
          ],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new LlamaAgent('llama-3.2-90b-text-preview');
      const result = await agent.call('Test prompt');

      expect(result).toBe('Test response from Llama');
      expect(mockFetch).toHaveBeenCalledWith('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        body: JSON.stringify({
          model: 'llama-3.2-90b-text-preview',
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

    it('should use custom baseUrl in API call', async () => {
      const customBaseUrl = 'https://custom.endpoint.com/v1';
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Response' } }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new LlamaAgent('llama-3.1-70b', 'test-key', customBaseUrl);
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        `${customBaseUrl}/chat/completions`,
        expect.any(Object)
      );
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

      const agent = new LlamaAgent();
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

      const agent = new LlamaAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });

    it('should throw error when API returns non-ok status', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new LlamaAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Llama API error: Error: HTTP error! status: 401');
    });

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('Network error');
      mockFetch.mockRejectedValue(mockError);

      const agent = new LlamaAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Llama API error: Error: Network error');
    });

    it('should use correct model in API call', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Response' } }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new LlamaAgent('llama-3.1-405b');
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"model":"llama-3.1-405b"'),
        })
      );
    });

    it('should use custom API key in headers', async () => {
      const customKey = 'custom-together-key';
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Response' } }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new LlamaAgent('llama-3.2-90b-text-preview', customKey);
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
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

      const agent = new LlamaAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Llama API error: Error: Invalid JSON');
    });

    it('should use correct parameters in API call', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Response' } }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new LlamaAgent();
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            model: 'llama-3.2-90b-text-preview',
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
  });

  describe('Agent Interface Compliance', () => {
    it('should implement Agent interface correctly', () => {
      const agent = new LlamaAgent();

      expect(typeof agent.name).toBe('string');
      expect(typeof agent.provider).toBe('string');
      expect(typeof agent.call).toBe('function');
      expect(agent.provider).toBe('Meta');
    });
  });
});