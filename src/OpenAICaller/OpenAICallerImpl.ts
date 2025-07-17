import { OpenAI } from "openai";
import OpenAICaller from "./OpenAICaller";

export class OpenAIImpl implements OpenAICaller {
  constructor(private readonly openai: OpenAI) { }

  async call(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })
    return response.choices[0].message.content ?? ""
  }
}

export default OpenAIImpl