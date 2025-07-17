import { OpenAI } from "openai";
import OpenAICaller from "./OpenAICaller";

export class OpenAIImpl implements OpenAICaller {
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(model: string) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = model;
  }

  async call(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
    })
    return response.choices[0].message.content ?? ""
  }
}

export default OpenAIImpl