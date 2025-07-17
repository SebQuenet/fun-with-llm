import { expect } from "vitest";
import { promptChainingUseCase } from "../prompt-chaining.usecase";
import FakeOpenAICaller, { SECOND_ANSWER } from "./FaleOpenAICaller";


let openAICaller: FakeOpenAICaller;
export const givenThereIsAnOpenAICaller = () => {
  openAICaller = new FakeOpenAICaller();
}


let answer: string;
export const whenCentralFeatureIsRequested = async () => {
  answer = await promptChainingUseCase({ openAICaller: openAICaller });
}

export const expectCentralFeatureToBeProperAnswer = () => {
  expect(answer).toBe(SECOND_ANSWER);
}


export const expectToHaveBothCallsBeenMade = () => {
  expect(openAICaller.getCallCount()).toBe(2);
}

export const expectSecondPromptToContainFirstPromptResponse = () => {
  const callHistory = openAICaller.getCallHistory();
  expect(callHistory).toHaveLength(2);

  const firstPrompt = callHistory[0];
  const secondPrompt = callHistory[1];

  expect(firstPrompt).toContain('most promising idea in edTech b2c');
  expect(firstPrompt).toContain('2025 in France');

  expect(secondPrompt).toContain('A personalized, gamified language learning platform');
  expect(secondPrompt).toContain('Give me details on the central feature');
}

export const expectPromptsToBeChained = () => {
  const callHistory = openAICaller.getCallHistory();

  const firstResponse = "A personalized, gamified language learning platform focused on conversational skills, integrating local dialects and cultural nuances, with real-time feedback from native speakers through video chat.";
  const secondPrompt = callHistory[1];

  expect(secondPrompt).toContain(`I want to do this application : ${firstResponse}`);
}