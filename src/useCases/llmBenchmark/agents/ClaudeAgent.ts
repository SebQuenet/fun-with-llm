import Agent from './Agent';

export class ClaudeAgent implements Agent {
  name: string;
  provider = 'Anthropic';
  private apiKey: string;
  private model: string;

  constructor(model: string = 'claude-3-5-sonnet-20241022', apiKey?: string) {
    this.name = `Claude ${model}`;
    this.model = model;
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable.');
    }
  }

  async call(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0]?.text || '';
    } catch (error) {
      throw new Error(`Claude API error: ${error}`);
    }
  }
}

export default ClaudeAgent;