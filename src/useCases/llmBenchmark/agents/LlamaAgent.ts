import Agent from './Agent';

export class LlamaAgent implements Agent {
  name: string;
  provider = 'Meta';
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(
    model: string = 'llama-3.2-90b-text-preview', 
    apiKey?: string, 
    baseUrl: string = 'https://api.together.xyz/v1'
  ) {
    this.name = `Llama ${model}`;
    this.model = model;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || process.env.TOGETHER_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('Together API key is required for Llama. Set TOGETHER_API_KEY environment variable.');
    }
  }

  async call(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      throw new Error(`Llama API error: ${error}`);
    }
  }
}

export default LlamaAgent;