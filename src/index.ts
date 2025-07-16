import { z } from 'zod'
import { OpenAI } from 'openai';
import dotenv from 'dotenv'
import readline from 'readline'

dotenv.config()

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0).optional(),
})

export type User = z.infer<typeof UserSchema>

export function validateUser(data: unknown): User {
  return UserSchema.parse(data)
}

export function isValidUser(data: unknown): data is User {
  return UserSchema.safeParse(data).success
}

export function greetUser(user: User): string {
  return `Hello, ${user.name}! Welcome to our LLM playground.`
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const main = async () => {
  const prompt = await readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  prompt.question("Enter a prompt: ", async (prompt) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })
    console.log(response.choices[0].message.content)
  })
}

main()