import { z } from 'zod'

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

console.log('here !');