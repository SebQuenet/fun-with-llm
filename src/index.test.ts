import { describe, it, expect } from 'vitest'
import { validateUser, isValidUser, greetUser, type User } from './index'

describe('User validation', () => {
  it('should validate a correct user object', () => {
    const validUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    }

    expect(() => validateUser(validUser)).not.toThrow()
    expect(isValidUser(validUser)).toBe(true)
  })

  it('should reject invalid user data', () => {
    const invalidUser = {
      id: 'not-a-number',
      name: 'John Doe',
      email: 'invalid-email',
    }

    expect(() => validateUser(invalidUser)).toThrow()
    expect(isValidUser(invalidUser)).toBe(false)
  })

  it('should work with optional age field', () => {
    const userWithoutAge = {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
    }

    expect(() => validateUser(userWithoutAge)).not.toThrow()
    expect(isValidUser(userWithoutAge)).toBe(true)
  })
})

describe('greetUser', () => {
  it('should greet a user correctly', () => {
    const user: User = {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
    }

    const greeting = greetUser(user)
    expect(greeting).toBe('Hello, Alice! Welcome to our LLM playground.')
  })
})