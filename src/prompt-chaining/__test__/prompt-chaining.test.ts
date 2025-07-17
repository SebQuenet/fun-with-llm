import { describe, it, expect } from 'vitest'
import FakeOpenAICaller, { SECOND_ANSWER } from './FaleOpenAICaller';

import { promptChainingUseCase } from '../prompt-chaining.usecase';
import {
  givenThereIsAnOpenAICaller,
  whenCentralFeatureIsRequested,
  expectCentralFeatureToBeProperAnswer,
  expectToHaveBothCallsBeenMade,
  expectSecondPromptToContainFirstPromptResponse,
  expectPromptsToBeChained
} from './fixtures';

describe('Prompt Chaining Use Case', () => {
  it('should pass the result of the first gpt call to the second one', async () => {

    await givenThereIsAnOpenAICaller();
    await whenCentralFeatureIsRequested();
    expectCentralFeatureToBeProperAnswer();
  })

  it('should make exactly 2 calls to the OpenAI caller', async () => {
    await givenThereIsAnOpenAICaller();
    await whenCentralFeatureIsRequested();
    expectToHaveBothCallsBeenMade();
  })

  it('should include the first call response in the second call prompt', async () => {
    await givenThereIsAnOpenAICaller();
    await whenCentralFeatureIsRequested();
    expectSecondPromptToContainFirstPromptResponse();
  })

  it('should properly chain prompts with dependency injection', async () => {
    await givenThereIsAnOpenAICaller();
    await whenCentralFeatureIsRequested();
    expectPromptsToBeChained();
  })
})
