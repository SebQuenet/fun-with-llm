import { TestScenario } from "./test-scenario";
import Agent from "../../agents/Agent";
import { llmBenchmarkUseCase } from "../../llm-benchmark.usecase";
import { MockOpenAIAgent } from "../mocks/MockOpenAIAgent";
import { MockClaudeAgent } from "../mocks/MockClaudeAgent";
import { MockLlamaAgent } from "../mocks/MockLlamaAgent";
import { MockDeepseekAgent } from "../mocks/MockDeepseekAgent";

export class TestScenarioBuilder {
  private agents: Agent[] = [];

  givenThereAreMultipleAgents(): TestScenarioBuilder {
    this.agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent(),
      new MockLlamaAgent(),
      new MockDeepseekAgent()
    ];
    return this;
  }

  givenThereAreSpecificAgents(agents: Agent[]): TestScenarioBuilder {
    this.agents = agents;
    return this;
  }

  givenThereAreTwoAgents(): TestScenarioBuilder {
    this.agents = [
      new MockOpenAIAgent(),
      new MockClaudeAgent()
    ];
    return this;
  }

  async whenBenchmarkIsExecuted(): Promise<TestScenario> {
    const result = await llmBenchmarkUseCase({ 
      agents: this.agents,
      openaiApiKey: 'test-api-key'
    });
    return new TestScenario(this.agents, result);
  }

  // Convenience method for common scenario
  async executeStandardBenchmark(): Promise<TestScenario> {
    return this.givenThereAreMultipleAgents()
               .whenBenchmarkIsExecuted();
  }
}