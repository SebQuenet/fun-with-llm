import { expect } from "vitest";
import FakeOpenAICaller from "./FakeOpenAICaller";
import { TEST_RESPONSES, EXPECTED_PROMPTS, EXPECTED_CALL_COUNT } from "./test-data";

export class TestScenario {
  constructor(
    private readonly openAICaller: FakeOpenAICaller,
    private readonly answer: string
  ) { }

  expectCentralFeatureToBeProperAnswer(): TestScenario {
    expect(this.answer).toBe(TEST_RESPONSES.SECOND);
    return this;
  }

  expectCallCount(count: number = EXPECTED_CALL_COUNT): TestScenario {
    expect(this.openAICaller.getCallCount()).toBe(count);
    return this;
  }

  expectFirstPromptContains(...fragments: string[]): TestScenario {
    const callHistory = this.openAICaller.getCallHistory();
    const firstPrompt = callHistory[0];

    fragments.forEach(fragment => {
      expect(firstPrompt).toContain(fragment);
    });
    return this;
  }

  expectSecondPromptContains(...fragments: string[]): TestScenario {
    const callHistory = this.openAICaller.getCallHistory();
    const secondPrompt = callHistory[1];

    fragments.forEach(fragment => {
      expect(secondPrompt).toContain(fragment);
    });
    return this;
  }

  expectPromptsToBeChained(): TestScenario {
    const callHistory = this.openAICaller.getCallHistory();
    expect(callHistory).toHaveLength(2);

    const secondPrompt = callHistory[1];
    expect(secondPrompt).toContain(`I want to do this application : ${TEST_RESPONSES.FIRST}`);
    return this;
  }

  expectStandardPromptFlow(): TestScenario {
    this.expectCallCount()
      .expectFirstPromptContains(...EXPECTED_PROMPTS.FIRST_CONTAINS)
      .expectSecondPromptContains(...EXPECTED_PROMPTS.SECOND_CONTAINS)
      .expectPromptsToBeChained();
    return this;
  }

  get callHistory(): string[] {
    return this.openAICaller.getCallHistory();
  }

  get callCount(): number {
    return this.openAICaller.getCallCount();
  }

  get result(): string {
    return this.answer;
  }
}