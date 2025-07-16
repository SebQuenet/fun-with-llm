# Fun with LLM

A TypeScript project for experimenting with Large Language Models, featuring OpenAI integration, schema validation with Zod, and testing with Vitest.

## Features

- 🤖 OpenAI GPT integration with interactive chat
- 🔍 Schema validation using Zod
- ⚡ Fast testing with Vitest
- 📝 TypeScript for type safety
- 🔄 Hot reload development with tsx

## Prerequisites

- Node.js (v18 or higher)
- OpenAI API key

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Run the interactive chat
```bash
npm start
```

This starts an interactive prompt where you can chat with GPT-4o-mini.

### Development commands
```bash
# Build the project
npm run build

# Type checking
npm run lint

# Watch mode compilation
npm run dev
```

### Testing
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run
```

## Project Structure

```
src/
├── index.ts          # Main application with OpenAI chat
└── index.test.ts     # Test file with Zod validation examples
```

## Example Code

The project includes examples of:
- Zod schema validation for user data
- Type-safe TypeScript interfaces
- OpenAI API integration
- Comprehensive test coverage with Vitest

## Dependencies

### Runtime
- **zod** - Schema validation
- **openai** - OpenAI API client
- **dotenv** - Environment variable management

### Development
- **typescript** - Type-safe JavaScript
- **vitest** - Fast unit testing
- **tsx** - TypeScript execution engine
- **@types/node** - Node.js type definitions

## License

ISC