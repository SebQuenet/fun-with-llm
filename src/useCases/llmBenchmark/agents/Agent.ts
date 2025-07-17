export interface Agent {
  name: string;
  provider: string;
  call(prompt: string): Promise<string>;
}

export default Agent;