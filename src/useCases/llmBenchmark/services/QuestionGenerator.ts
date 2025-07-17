import { OpenAIAgent } from '../agents/OpenAIAgent';

export class QuestionGenerator {
  private openaiAgent: OpenAIAgent;

  constructor(apiKey?: string) {
    this.openaiAgent = new OpenAIAgent('gpt-4o-mini', apiKey);
  }

  async generateBenchmarkQuestion(): Promise<string> {
    const prompt = `Generate a challenging question that can serve as a comprehensive benchmark to compare different AI language models. The question should:

1. Be intellectually demanding and require deep analytical thinking
2. Have multiple layers of complexity that allow for nuanced responses
3. Test reasoning, creativity, knowledge synthesis, and critical thinking
4. Be specific enough to allow for meaningful comparison between models
5. Be open-ended enough to showcase each model's unique strengths

The question should be in a domain that requires:
- Multi-step reasoning
- Integration of knowledge from multiple fields
- Creative problem-solving
- Ethical considerations or trade-offs
- Real-world application

Return only the question text, nothing else.`;

    return await this.openaiAgent.call(prompt);
  }
}