import Agent from '../../agents/Agent';

export class MockLlamaAgent implements Agent {
  name = 'Llama 3.2';
  provider = 'Meta';

  async call(prompt: string): Promise<string> {
    return `Llama response to: ${prompt}`;
  }
}

export default MockLlamaAgent;