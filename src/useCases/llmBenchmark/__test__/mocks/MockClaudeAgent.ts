import Agent from '../../agents/Agent';

export class MockClaudeAgent implements Agent {
  name = 'Claude 3.5 Sonnet';
  provider = 'Anthropic';

  async call(prompt: string): Promise<string> {
    return `Claude response to: ${prompt}`;
  }
}

export default MockClaudeAgent;