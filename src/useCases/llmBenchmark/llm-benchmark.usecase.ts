import Agent from './agents/Agent';

export interface LlmBenchmarkResult {
  agents: Agent[];
  totalAgents: number;
}

export const llmBenchmarkUseCase = async ({ agents }: { agents: Agent[] }): Promise<LlmBenchmarkResult> => {
  return {
    agents,
    totalAgents: agents.length
  };
};

export default llmBenchmarkUseCase;