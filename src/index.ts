import { OpenAI } from 'openai';
import dotenv from 'dotenv'
import { promptChainingUseCase } from './prompt-chaining.usecase';
import OpenAIImpl from './OpenAICaller/OpenAICallerImpl';

dotenv.config()

const main = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openAICaller = new OpenAIImpl(openai)
  await promptChainingUseCase({ openAICaller })
}

main()