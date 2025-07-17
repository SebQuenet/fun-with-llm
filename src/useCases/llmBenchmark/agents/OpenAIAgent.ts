import { OpenAI } from 'openai';
import Agent from './Agent';

export class OpenAIAgent implements Agent {
  name: string;
  provider = 'OpenAI';
  private openai: OpenAI;

  constructor(model: string = 'gpt-4o-mini', apiKey?: string) {
    this.name = `OpenAI ${model}`;
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async call(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.name.replace('OpenAI ', ''),
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      throw new Error(`OpenAI API error: ${error}`);
    }
  }
}

export default OpenAIAgent;