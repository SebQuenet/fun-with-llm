import Agent from '../../agents/Agent';

export class MockDeepseekAgent implements Agent {
  name = 'Deepseek V3';
  provider = 'Deepseek';

  async call(prompt: string): Promise<string> {
    return `Deepseek response to: ${prompt}`;
  }
}

export default MockDeepseekAgent;