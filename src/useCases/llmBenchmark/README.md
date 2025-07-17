# LLM Benchmark Use Case

This use case allows you to instantiate and benchmark multiple LLM agents from different providers.

## Supported Providers

- **OpenAI** - GPT models (gpt-4o-mini, gpt-4, etc.)
- **Anthropic** - Claude models (claude-3-5-sonnet, etc.)
- **Meta** - Llama models via Together.ai (llama-3.2-90b, etc.)
- **Deepseek** - Deepseek models (deepseek-chat, etc.)

## Environment Variables

Set up the following environment variables in your `.env` file:

```env
# Required for OpenAI
OPENAI_API_KEY=your_openai_api_key

# Required for Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# Required for Llama (via Together.ai)
TOGETHER_API_KEY=your_together_api_key

# Required for Deepseek
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## Usage

### Using the Agent Factory

```typescript
import { AgentFactory } from './agents/AgentFactory';

// Create standard benchmark agents
const agents = AgentFactory.createStandardBenchmarkAgents();

// Create specific agents
const customAgents = AgentFactory.createMultipleAgents([
  { type: 'openai', model: 'gpt-4' },
  { type: 'claude', model: 'claude-3-5-sonnet-20241022' }
]);

// Create custom benchmark with specific models
const customBenchmark = AgentFactory.createCustomBenchmarkAgents({
  openai: 'gpt-4',
  claude: 'claude-3-5-sonnet-20241022'
});
```

### Individual Agent Usage

```typescript
import { OpenAIAgent } from './agents/OpenAIAgent';
import { ClaudeAgent } from './agents/ClaudeAgent';

// Create individual agents
const openaiAgent = new OpenAIAgent('gpt-4o-mini');
const claudeAgent = new ClaudeAgent('claude-3-5-sonnet-20241022');

// Use agents
const response1 = await openaiAgent.call("What is TypeScript?");
const response2 = await claudeAgent.call("What is TypeScript?");
```

### Using the Benchmark Use Case

```typescript
import { llmBenchmarkUseCase } from './llm-benchmark.usecase';
import { AgentFactory } from './agents/AgentFactory';

const agents = AgentFactory.createStandardBenchmarkAgents();
const result = await llmBenchmarkUseCase({ agents });

console.log(`Initialized ${result.totalAgents} agents`);
```

## Running the Example

```bash
# Make sure you have the required API keys in your .env file
npm run start -- src/useCases/llmBenchmark/example.ts
```

## Agent Interface

All agents implement the `Agent` interface:

```typescript
interface Agent {
  name: string;        // Human-readable agent name
  provider: string;    // Provider name (OpenAI, Anthropic, etc.)
  call(prompt: string): Promise<string>;  // Send prompt and get response
}
```

## Error Handling

Each agent includes proper error handling:
- Missing API keys throw descriptive errors
- API failures are caught and re-thrown with context
- Network errors are handled gracefully

## Testing

The test suite uses mock agents to verify functionality without making real API calls:

```bash
npm test  # Run all tests including LLM benchmark tests
```