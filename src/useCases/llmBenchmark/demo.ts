import { llmBenchmarkUseCase } from './llm-benchmark.usecase';
import { AgentFactory } from './agents/AgentFactory';

async function runBenchmarkDemo() {
  console.log('🎯 Starting LLM Benchmark Demo\n');

  try {
    // Create agents for benchmarking
    const agents = [
      AgentFactory.createAgent({ type: 'openai', model: 'gpt-4o-mini' }),
      AgentFactory.createAgent({ type: 'claude', model: 'claude-3-5-sonnet-20241022' }),
      AgentFactory.createAgent({ type: 'llama', model: 'llama-3.2-90b-text-preview' }),
      AgentFactory.createAgent({ type: 'deepseek', model: 'deepseek-chat' })
    ];

    console.log(`📊 Running benchmark with ${agents.length} agents:\n`);
    agents.forEach(agent => {
      console.log(`  • ${agent.name} (${agent.provider})`);
    });
    console.log('\n');

    // Run the benchmark
    const result = await llmBenchmarkUseCase({ 
      agents,
      // openaiApiKey: 'your-openai-key-here' // Optional: provide explicit key
    });

    // Display results
    console.log('🏆 BENCHMARK RESULTS');
    console.log('=' + '='.repeat(80));
    console.log('\n📝 Question:');
    console.log(result.question);
    console.log('\n');

    console.log('🏅 LEADERBOARD:');
    console.log('-'.repeat(80));
    result.leaderboard.rankings.forEach((ranking, index) => {
      console.log(`\n${index + 1}. ${ranking.agentName} (${ranking.provider}) - Score: ${ranking.score}/100`);
      console.log(`   Strengths: ${ranking.strengths.join(', ')}`);
      console.log(`   Weaknesses: ${ranking.weaknesses.join(', ')}`);
      console.log(`   Rationale: ${ranking.rationale}`);
    });

    console.log('\n📊 OVERALL ANALYSIS:');
    console.log('-'.repeat(80));
    console.log(result.leaderboard.overallAnalysis);

    console.log('\n✅ Benchmark completed successfully!');
    console.log(`📅 Timestamp: ${result.leaderboard.timestamp}`);

    return result;

  } catch (error) {
    console.error('❌ Benchmark failed:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmarkDemo().catch(console.error);
}

export default runBenchmarkDemo;