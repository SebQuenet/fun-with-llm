import { expect } from "vitest";
import { promptChainingUseCase } from "../prompt-chaining.usecase";
import { FakeOpenAICaller, SECOND_ANSWER } from "./FakeOpenAICaller";

export class TestScenarioBuilder {
  private openAICaller?: FakeOpenAICaller;
  private answer?: string;

  givenThereIsAnOpenAICaller(): TestScenarioBuilder {
    this.openAICaller = new FakeOpenAICaller();
    return this;
  }

  async whenCentralFeatureIsRequested(): Promise<TestScenarioBuilder> {
    if (!this.openAICaller) {
      throw new Error('OpenAI caller not initialized. Call givenThereIsAnOpenAICaller() first.');
    }
    this.answer = await promptChainingUseCase({ openAICaller: this.openAICaller });
    return this;
  }

  expectCentralFeatureToBeProperAnswer(): TestScenarioBuilder {
    expect(this.answer).toBe(SECOND_ANSWER);
    return this;
  }

  expectToHaveBothCallsBeenMade(): TestScenarioBuilder {
    if (!this.openAICaller) {
      throw new Error('OpenAI caller not initialized. Call givenThereIsAnOpenAICaller() first.');
    }
    expect(this.openAICaller.getCallCount()).toBe(2);
    return this;
  }

  expectSecondPromptToContainFirstPromptResponse(): TestScenarioBuilder {
    if (!this.openAICaller) {
      throw new Error('OpenAI caller not initialized. Call givenThereIsAnOpenAICaller() first.');
    }
    const callHistory = this.openAICaller.getCallHistory();
    expect(callHistory).toHaveLength(2);

    const firstPrompt = callHistory[0];
    const secondPrompt = callHistory[1];

    expect(firstPrompt).toContain('most promising idea in edTech b2c');
    expect(firstPrompt).toContain('2025 in France');

    expect(secondPrompt).toContain('A personalized, gamified language learning platform');
    expect(secondPrompt).toContain('Give me details on the central feature');
    return this;
  }

  expectPromptsToBeChained(): TestScenarioBuilder {
    if (!this.openAICaller) {
      throw new Error('OpenAI caller not initialized. Call givenThereIsAnOpenAICaller() first.');
    }
    const callHistory = this.openAICaller.getCallHistory();

    const firstResponse = "A personalized, gamified language learning platform focused on conversational skills, integrating local dialects and cultural nuances, with real-time feedback from native speakers through video chat.";
    const secondPrompt = callHistory[1];

    expect(secondPrompt).toContain(`I want to do this application : ${firstResponse}`);
    return this;
  }
}