import { describe, it, expect } from 'vitest'
import FakeOpenAICaller, { SECOND_ANSWER } from './FaleOpenAICaller';

import { promptChainingUseCase } from '../prompt-chaining.usecase';


describe('Prompt Chaining Use Case', () => {
  it('should pass the result of the first gpt call to the second one', async () => {
    // Arrange
    const fakeOpenAICaller = new FakeOpenAICaller();

    // Act
    const centralFeature = await promptChainingUseCase({ openAICaller: fakeOpenAICaller });

    // Assert
    expect(centralFeature).toBe(SECOND_ANSWER);
  })

  it('should make exactly 2 calls to the OpenAI caller', async () => {
    // Arrange
    const fakeOpenAICaller = new FakeOpenAICaller();

    // Act
    await promptChainingUseCase({ openAICaller: fakeOpenAICaller });

    // Assert
    expect(fakeOpenAICaller.getCallCount()).toBe(2);
  })

  it('should include the first call response in the second call prompt', async () => {
    // Arrange
    const fakeOpenAICaller = new FakeOpenAICaller();

    // Act
    await promptChainingUseCase({ openAICaller: fakeOpenAICaller });

    // Assert
    const callHistory = fakeOpenAICaller.getCallHistory();
    expect(callHistory).toHaveLength(2);
    
    const firstPrompt = callHistory[0];
    const secondPrompt = callHistory[1];
    
    // Verify first prompt asks for business idea
    expect(firstPrompt).toContain('most promising idea in edTech b2c');
    expect(firstPrompt).toContain('2025 in France');
    
    // Verify second prompt contains the first response
    expect(secondPrompt).toContain('A personalized, gamified language learning platform');
    expect(secondPrompt).toContain('Give me details on the central feature');
  })

  it('should properly chain prompts with dependency injection', async () => {
    // Arrange
    const fakeOpenAICaller = new FakeOpenAICaller();

    // Act
    const result = await promptChainingUseCase({ openAICaller: fakeOpenAICaller });

    // Assert
    const callHistory = fakeOpenAICaller.getCallHistory();
    
    // Verify the chaining logic: second prompt must include first response
    const firstResponse = "A personalized, gamified language learning platform focused on conversational skills, integrating local dialects and cultural nuances, with real-time feedback from native speakers through video chat.";
    const secondPrompt = callHistory[1];
    
    expect(secondPrompt).toContain(`I want to do this application : ${firstResponse}`);
    expect(result).toBe(SECOND_ANSWER);
  })
})
