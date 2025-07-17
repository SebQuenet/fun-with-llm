import { promptChainingUseCase } from "../prompt-chaining.usecase";
import FakeOpenAICaller from "./FakeOpenAICaller";
import { TestScenario } from "./test-scenario";

export class TestScenarioBuilder {
  private openAICaller?: FakeOpenAICaller;

  givenThereIsAnOpenAICaller(): TestScenarioBuilder {
    this.openAICaller = new FakeOpenAICaller();
    return this;
  }

  givenThereIsAnOpenAICallerWith(customCaller: FakeOpenAICaller): TestScenarioBuilder {
    this.openAICaller = customCaller;
    return this;
  }

  async whenCentralFeatureIsRequested(): Promise<TestScenario> {
    if (!this.openAICaller) {
      throw new Error('OpenAI caller not initialized. Call givenThereIsAnOpenAICaller() first.');
    }

    const answer = await promptChainingUseCase({ openAICaller: this.openAICaller });
    return new TestScenario(this.openAICaller, answer);
  }

  async whenUseCaseExecutes(): Promise<TestScenario> {
    return this.whenCentralFeatureIsRequested();
  }

  // Convenience method for common scenario
  async executeStandardScenario(): Promise<TestScenario> {
    return this.givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested();
  }
}