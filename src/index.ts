import { OpenAI } from 'openai';
import dotenv from 'dotenv'
import { promptChainingUseCase } from './useCases/prompt-chaining/prompt-chaining.usecase';
import OpenAIImpl from './OpenAICaller/OpenAICallerImpl';

dotenv.config()

const main = async () => {
  const openAICaller = new OpenAIImpl("gpt-4o-mini");
  await promptChainingUseCase({ openAICaller })
}

main()