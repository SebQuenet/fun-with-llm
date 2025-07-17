# Fun with LLM

A comprehensive TypeScript project for experimenting with Large Language Models, featuring multi-LLM benchmarking, prompt chaining, schema validation with Zod, and testing with Vitest.

## 🎯 Use Cases

### 1. Prompt Chaining
Demonstrates chaining multiple prompts together, where the output of one becomes the input for the next.

### 2. LLM Benchmark System
A comprehensive AI benchmarking system that evaluates and compares multiple language models:

#### 🔧 **Core Workflow**
1. **Question Generation**: Uses OpenAI GPT-4o mini to generate challenging benchmark questions
2. **Multi-LLM Evaluation**: Sends questions to all configured LLMs for analysis
3. **Intelligent Judging**: Uses GPT-4o mini to evaluate responses and create ranked leaderboards

#### 🤖 **Supported LLMs**
- **OpenAI GPT-4o mini** (via OpenAI SDK)
- **Claude 3.5 Sonnet** (via Anthropic API)
- **Llama 3.2** (via Together.ai API)  
- **Deepseek V3** (via Deepseek API)

#### ✨ **Features**
- **Automated Question Generation**: Creates intellectually demanding questions testing reasoning, creativity, and knowledge synthesis
- **Comprehensive Analysis**: Each LLM provides detailed analysis demonstrating their capabilities
- **AI-Powered Judging**: Evaluates responses across multiple criteria (accuracy, depth, creativity, clarity)
- **Detailed Leaderboards**: JSON output with scores, strengths, weaknesses, and rationale for each LLM
- **Agent Factory**: Easy instantiation with flexible configuration
- **Mock Testing**: Comprehensive test coverage with mock agents
- **Edge Case Handling**: Robust error handling and boundary testing

#### 📊 **Evaluation Criteria**
- Accuracy and factual correctness
- Depth of analysis and reasoning  
- Creativity and innovation in approach
- Completeness of response
- Clarity and structure
- Practical applicability
- Handling of complexity and nuance
- Evidence of critical thinking

## Features

- 🤖 Multi-LLM integration with 4 major providers
- 🏆 Automated benchmarking and evaluation system
- 🔍 Schema validation using Zod
- ⚡ Fast testing with Vitest
- 📝 TypeScript for type safety
- 🔄 Hot reload development with tsx
- 🧪 Comprehensive test coverage (160+ tests)

## Prerequisites

- Node.js (v18 or higher)
- API keys for desired LLM providers:
  - OpenAI API key (required for benchmarking)
  - Anthropic API key (for Claude)
  - Together API key (for Llama)
  - Deepseek API key (for Deepseek)

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   TOGETHER_API_KEY=your_together_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

## Usage

### Run LLM Benchmark Demo
```bash
# Execute a full benchmark comparison
npx tsx src/useCases/llmBenchmark/demo.ts
```

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

# Run specific test suites
npm test -- edge-cases.test.ts
npm test -- new-benchmark-workflow.test.ts
```

## Project Structure

```
src/
├── index.ts                           # Main application entry point
├── useCases/
│   ├── prompt-chaining/              # Prompt chaining use case
│   │   ├── prompt-chaining.usecase.ts
│   │   └── __test__/
│   └── llmBenchmark/                 # LLM benchmarking system
│       ├── llm-benchmark.usecase.ts  # Main benchmark orchestrator
│       ├── demo.ts                   # Benchmark demo runner
│       ├── agents/                   # LLM agent implementations
│       │   ├── Agent.ts              # Agent interface
│       │   ├── AgentFactory.ts       # Agent factory
│       │   ├── OpenAIAgent.ts        # OpenAI implementation
│       │   ├── ClaudeAgent.ts        # Claude implementation
│       │   ├── LlamaAgent.ts         # Llama implementation
│       │   └── DeepseekAgent.ts      # Deepseek implementation
│       ├── services/                 # Core services
│       │   ├── QuestionGenerator.ts  # Benchmark question generator
│       │   └── ResponseJudge.ts      # Response evaluation service
│       └── __test__/                 # Comprehensive test suite
│           ├── agents/               # Individual agent tests
│           ├── mocks/                # Mock implementations
│           ├── utils/                # Test utilities
│           ├── new-benchmark-workflow.test.ts
│           ├── agent-factory.test.ts
│           ├── edge-cases.test.ts
│           └── benchmarking-scenarios.test.ts
└── CLAUDE.md                        # Development context file
```

## Example Usage

### Basic LLM Benchmark
```typescript
import { llmBenchmarkUseCase } from './src/useCases/llmBenchmark/llm-benchmark.usecase';
import { AgentFactory } from './src/useCases/llmBenchmark/agents/AgentFactory';

// Create agents
const agents = [
  AgentFactory.createAgent({ type: 'openai', model: 'gpt-4o-mini' }),
  AgentFactory.createAgent({ type: 'claude', model: 'claude-3-5-sonnet-20241022' }),
  AgentFactory.createAgent({ type: 'llama', model: 'llama-3.2-90b-text-preview' }),
  AgentFactory.createAgent({ type: 'deepseek', model: 'deepseek-chat' })
];

// Run benchmark
const result = await llmBenchmarkUseCase({ agents });

// Access results
console.log('Question:', result.question);
console.log('Leaderboard:', result.leaderboard.rankings);
```

### Agent Factory Usage
```typescript
import { AgentFactory } from './src/useCases/llmBenchmark/agents/AgentFactory';

// Create individual agents
const openaiAgent = AgentFactory.createAgent({ 
  type: 'openai', 
  model: 'gpt-4o-mini',
  apiKey: 'custom-key'
});

// Create multiple agents
const agents = AgentFactory.createMultipleAgents([
  { type: 'openai', model: 'gpt-4o-mini' },
  { type: 'claude', model: 'claude-3-5-sonnet-20241022' }
]);

// Create benchmark set
const benchmarkAgents = AgentFactory.createBenchmarkAgents();
```

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

## Testing

The project includes comprehensive testing with 160+ tests covering:
- Individual agent functionality
- Agent factory patterns
- Edge cases and error handling
- Benchmarking scenarios
- Integration workflows
- Performance testing

## License

ISC