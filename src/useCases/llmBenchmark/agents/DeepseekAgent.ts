import Agent from './Agent';

export class DeepseekAgent implements Agent {
  name: string;
  provider = 'Deepseek';
  private apiKey: string;
  private model: string;

  constructor(model: string = 'deepseek-chat', apiKey?: string) {
    this.name = `Deepseek ${model}`;
    this.model = model;
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('Deepseek API key is required. Set DEEPSEEK_API_KEY environment variable.');
    }
  }

  async call(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
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
      throw new Error(`Deepseek API error: ${error}`);
    }
  }
}

export default DeepseekAgent;