import Agent from './Agent';
import { OpenAIAgent } from './OpenAIAgent';
import { ClaudeAgent } from './ClaudeAgent';
import { LlamaAgent } from './LlamaAgent';
import { DeepseekAgent } from './DeepseekAgent';

export type AgentType = 'openai' | 'claude' | 'llama' | 'deepseek';

export interface AgentConfig {
  type: AgentType;
  model?: string;
  apiKey?: string;
  baseUrl?: string; // For Llama/custom endpoints
}

export class AgentFactory {
  static createAgent(config: AgentConfig): Agent {
    switch (config.type) {
      case 'openai':
        return new OpenAIAgent(config.model, config.apiKey);
      
      case 'claude':
        return new ClaudeAgent(config.model, config.apiKey);
      
      case 'llama':
        return new LlamaAgent(config.model, config.apiKey, config.baseUrl);
      
      case 'deepseek':
        return new DeepseekAgent(config.model, config.apiKey);
      
      default:
        throw new Error(`Unsupported agent type: ${config.type}`);
    }
  }

  static createMultipleAgents(configs: AgentConfig[]): Agent[] {
    return configs.map(config => this.createAgent(config));
  }

  // Convenience method for creating standard benchmark agents
  static createStandardBenchmarkAgents(): Agent[] {
    const configs: AgentConfig[] = [
      { type: 'openai', model: 'gpt-4o-mini' },
      { type: 'claude', model: 'claude-3-5-sonnet-20241022' },
      { type: 'llama', model: 'llama-3.2-90b-text-preview' },
      { type: 'deepseek', model: 'deepseek-chat' },
    ];

    return this.createMultipleAgents(configs);
  }

  // Create agents with custom models
  static createCustomBenchmarkAgents(modelConfigs: { [key in AgentType]?: string }): Agent[] {
    const configs: AgentConfig[] = [];

    if (modelConfigs.openai) {
      configs.push({ type: 'openai', model: modelConfigs.openai });
    }
    if (modelConfigs.claude) {
      configs.push({ type: 'claude', model: modelConfigs.claude });
    }
    if (modelConfigs.llama) {
      configs.push({ type: 'llama', model: modelConfigs.llama });
    }
    if (modelConfigs.deepseek) {
      configs.push({ type: 'deepseek', model: modelConfigs.deepseek });
    }

    return this.createMultipleAgents(configs);
  }
}

export default AgentFactory;