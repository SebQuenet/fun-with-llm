import { describe, it } from 'vitest';
import { TestScenarioBuilder } from './utils/test-scenario-builder';
import { MockOpenAIAgent } from './mocks/MockOpenAIAgent';
import { MockClaudeAgent } from './mocks/MockClaudeAgent';

describe('LLM Benchmark', () => {
  it('should instantiate multiple different LLM agents', async () => {
    const scenario = await new TestScenarioBuilder()
      .givenThereAreMultipleAgents()
      .whenBenchmarkIsExecuted();

    scenario.expectAgentsToBeInstantiated()
      .expectSpecificNumberOfAgents(4)
      .expectAgentProviders('OpenAI', 'Anthropic', 'Meta', 'Deepseek');
  });

  it('should instantiate two different LLM agents', async () => {
    const scenario = await new TestScenarioBuilder()
      .givenThereAreTwoAgents()
      .whenBenchmarkIsExecuted();

    scenario.expectAgentsToBeInstantiated()
      .expectSpecificNumberOfAgents(2)
      .expectAgentProviders('OpenAI', 'Anthropic');
  });

  it('should instantiate specific agents provided', async () => {
    const customAgents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent()
    ];

    const scenario = await new TestScenarioBuilder()
      .givenThereAreSpecificAgents(customAgents)
      .whenBenchmarkIsExecuted();

    scenario.expectAgentsToBeInstantiated()
      .expectSpecificNumberOfAgents(2)
      .expectAgentNames('OpenAI GPT-4', 'Claude 3.5 Sonnet');
  });

  it('should handle benchmark execution with agents', async () => {
    const scenario = await new TestScenarioBuilder()
      .executeStandardBenchmark();

    scenario.expectAgentsToBeInstantiated()
      .expectSpecificNumberOfAgents(4);
  });
});