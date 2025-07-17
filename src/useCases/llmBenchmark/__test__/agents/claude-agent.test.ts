import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ClaudeAgent } from '../../agents/ClaudeAgent';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('ClaudeAgent', () => {
  beforeEach(() => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-api-key');
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create agent with default model', () => {
      const agent = new ClaudeAgent();

      expect(agent.name).toBe('Claude claude-3-5-sonnet-20241022');
      expect(agent.provider).toBe('Anthropic');
    });

    it('should create agent with custom model', () => {
      const agent = new ClaudeAgent('claude-3-opus');

      expect(agent.name).toBe('Claude claude-3-opus');
      expect(agent.provider).toBe('Anthropic');
    });

    it('should create agent with custom API key', () => {
      const customKey = 'custom-api-key';
      const agent = new ClaudeAgent('claude-3-5-sonnet-20241022', customKey);

      expect(agent.name).toBe('Claude claude-3-5-sonnet-20241022');
      expect(agent.provider).toBe('Anthropic');
    });

    it('should throw error when no API key is provided', () => {
      vi.stubEnv('ANTHROPIC_API_KEY', '');

      expect(() => new ClaudeAgent()).toThrow('Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable.');
    });

    it('should use custom API key when environment variable is missing', () => {
      vi.stubEnv('ANTHROPIC_API_KEY', '');
      const customKey = 'custom-api-key';

      expect(() => new ClaudeAgent('claude-3-5-sonnet-20241022', customKey)).not.toThrow();
    });
  });

  describe('call method', () => {
    it('should make successful API call and return response', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [
            {
              text: 'Test response from Claude',
            },
          ],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new ClaudeAgent('claude-3-5-sonnet-20241022');
      const result = await agent.call('Test prompt');

      expect(result).toBe('Test response from Claude');
      expect(mockFetch).toHaveBeenCalledWith('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: 'Test prompt',
            },
          ],
        }),
      });
    });

    it('should handle empty response content', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new ClaudeAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });

    it('should handle missing text in response content', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [
            {
              text: null,
            },
          ],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new ClaudeAgent();
      const result = await agent.call('Test prompt');

      expect(result).toBe('');
    });

    it('should throw error when API returns non-ok status', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new ClaudeAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Claude API error: Error: HTTP error! status: 401');
    });

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('Network error');
      mockFetch.mockRejectedValue(mockError);

      const agent = new ClaudeAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Claude API error: Error: Network error');
    });

    it('should use correct model in API call', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [{ text: 'Response' }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new ClaudeAgent('claude-3-opus');
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          body: expect.stringContaining('"model":"claude-3-opus"'),
        })
      );
    });

    it('should use custom API key in headers', async () => {
      const customKey = 'custom-claude-key';
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          content: [{ text: 'Response' }],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const agent = new ClaudeAgent('claude-3-5-sonnet-20241022', customKey);
      await agent.call('Test prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': customKey,
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

      const agent = new ClaudeAgent();

      await expect(agent.call('Test prompt')).rejects.toThrow('Claude API error: Error: Invalid JSON');
    });
  });

  describe('Agent Interface Compliance', () => {
    it('should implement Agent interface correctly', () => {
      const agent = new ClaudeAgent();

      expect(typeof agent.name).toBe('string');
      expect(typeof agent.provider).toBe('string');
      expect(typeof agent.call).toBe('function');
      expect(agent.provider).toBe('Anthropic');
    });
  });
});