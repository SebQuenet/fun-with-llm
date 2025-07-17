import { describe, it } from 'vitest'
import { TestScenarioBuilder } from './test-scenario-builder';
import { EXPECTED_PROMPTS } from './test-data';

describe('Prompt Chaining Use Case', () => {
  it('should pass the result of the first gpt call to the second one', async () => {
    const scenario = await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested();

    scenario.expectCentralFeatureToBeProperAnswer();
  });

  it('should make exactly 2 calls to the OpenAI caller', async () => {
    const scenario = await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested();

    scenario.expectCallCount(2);
  });

  it('should include the first call response in the second call prompt', async () => {
    const scenario = await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested();

    scenario.expectFirstPromptContains(...EXPECTED_PROMPTS.FIRST_CONTAINS)
            .expectSecondPromptContains(...EXPECTED_PROMPTS.SECOND_CONTAINS);
  });

  it('should properly chain prompts with dependency injection', async () => {
    const scenario = await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested();

    scenario.expectPromptsToBeChained();
  });

  it('should validate complete prompt chaining flow', async () => {
    const scenario = await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested();

    scenario.expectStandardPromptFlow();
  });
});