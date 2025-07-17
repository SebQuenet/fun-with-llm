import { describe, it } from 'vitest'
import { TestScenarioBuilder } from './fixtures';

describe('Prompt Chaining Use Case', () => {
  it('should pass the result of the first gpt call to the second one', async () => {
    await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested()
      .then(builder => builder.expectCentralFeatureToBeProperAnswer());
  })

  it('should make exactly 2 calls to the OpenAI caller', async () => {
    await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested()
      .then(builder => builder.expectToHaveBothCallsBeenMade());
  })

  it('should include the first call response in the second call prompt', async () => {
    await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested()
      .then(builder => builder.expectSecondPromptToContainFirstPromptResponse());
  })

  it('should properly chain prompts with dependency injection', async () => {
    await new TestScenarioBuilder()
      .givenThereIsAnOpenAICaller()
      .whenCentralFeatureIsRequested()
      .then(builder => builder.expectPromptsToBeChained());
  })
})
