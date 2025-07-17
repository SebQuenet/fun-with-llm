import OpenAICaller from "../OpenAICaller/OpenAICaller";

export class FakeOpenAICaller implements OpenAICaller {
  constructor() { }

  async call(prompt: string): Promise<string> {
    return "This is a fake response"
  }
}

export default FakeOpenAICaller