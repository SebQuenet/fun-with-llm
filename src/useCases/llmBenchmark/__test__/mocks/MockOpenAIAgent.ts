import Agent from '../../agents/Agent';

export class MockOpenAIAgent implements Agent {
  name = 'OpenAI GPT-4';
  provider = 'OpenAI';

  async call(prompt: string): Promise<string> {
    return `OpenAI response to: ${prompt}`;
  }
}

export default MockOpenAIAgent;