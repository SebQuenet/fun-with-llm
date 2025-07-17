import { llmBenchmarkUseCase } from './llm-benchmark.usecase';
import { AgentFactory } from './agents/AgentFactory';
import dotenv from 'dotenv';

dotenv.config();

async function runBenchmarkExample() {
  try {
    console.log('🚀 Starting LLM Benchmark Example...\n');

    // Create agents using the factory
    const agents = AgentFactory.createStandardBenchmarkAgents();
    
    console.log(`📊 Created ${agents.length} agents:`);
    agents.forEach(agent => {
      console.log(`  - ${agent.name} (${agent.provider})`);
    });
    console.log();

    // Run the benchmark use case
    const result = await llmBenchmarkUseCase({ agents });
    
    console.log(`✅ Benchmark initialized with ${result.totalAgents} agents\n`);

    // Test each agent with a simple prompt
    const testPrompt = "What is the capital of France?";
    console.log(`🧪 Testing all agents with prompt: "${testPrompt}"\n`);

    for (const agent of agents) {
      try {
        console.log(`🤖 Testing ${agent.name}...`);
        const response = await agent.call(testPrompt);
        console.log(`✅ Response: ${response}\n`);
      } catch (error) {
        console.log(`❌ Error with ${agent.name}: ${error}\n`);
      }
    }

    console.log('🎉 Benchmark example completed!');

  } catch (error) {
    console.error('❌ Benchmark example failed:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmarkExample();
}

export { runBenchmarkExample };