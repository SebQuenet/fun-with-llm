import OpenAICaller from "../../../..//OpenAICaller/OpenAICaller";

const FIRST_ANSWER = "A personalized, gamified language learning platform focused on conversational skills, integrating local dialects and cultural nuances, with real-time feedback from native speakers through video chat.";
export const SECOND_ANSWER = "The central feature of the application is the ability to chat with native speakers in real-time, with a focus on conversational skills and cultural nuances.";

export class FakeOpenAICaller implements OpenAICaller {

  private nbCalls = 0;
  private callHistory: string[] = [];

  constructor() { }

  async call(prompt: string): Promise<string> {
    this.callHistory.push(prompt);
    this.nbCalls++;
    switch (this.nbCalls) {
      case 1:
        return FIRST_ANSWER;
      case 2:
        return SECOND_ANSWER;
      default:
        throw new Error("Too many calls to FakeOpenAICaller");
    }
  }

  getCallHistory(): string[] {
    return [...this.callHistory];
  }

  getCallCount(): number {
    return this.nbCalls;
  }
}

export default FakeOpenAICaller