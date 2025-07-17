import { expect } from "vitest";
import Agent from "../../agents/Agent";
import { LlmBenchmarkResult } from "../../llm-benchmark.usecase";

export class TestScenario {
  constructor(
    private readonly agents: Agent[],
    private readonly result: LlmBenchmarkResult
  ) { }

  expectAgentsToBeInstantiated(): TestScenario {
    expect(this.agents.length).toBeGreaterThan(0);
    expect(this.result.totalAgents).toBe(this.agents.length);
    return this;
  }

  expectSpecificNumberOfAgents(count: number): TestScenario {
    expect(this.agents.length).toBe(count);
    expect(this.result.totalAgents).toBe(count);
    return this;
  }

  expectAgentProviders(...expectedProviders: string[]): TestScenario {
    const actualProviders = this.agents.map(agent => agent.provider);
    expectedProviders.forEach(provider => {
      expect(actualProviders).toContain(provider);
    });
    return this;
  }

  expectAgentNames(...expectedNames: string[]): TestScenario {
    const actualNames = this.agents.map(agent => agent.name);
    expectedNames.forEach(name => {
      expect(actualNames).toContain(name);
    });
    return this;
  }

  // Getters for raw data access if needed
  get agentList(): Agent[] {
    return this.agents;
  }

  get benchmarkResult(): LlmBenchmarkResult {
    return this.result;
  }
}