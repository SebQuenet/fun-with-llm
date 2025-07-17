import OpenAICaller from "../OpenAICaller/OpenAICaller";

export const _promptChainingUseCase = async ({ openAICaller }: { openAICaller: OpenAICaller }, { prompt1, prompt2 }: { prompt1: string, prompt2: (response1: string) => string }) => {
  console.log('first call - asking for business idea');
  const response1 = await openAICaller.call(prompt1);
  console.log('second call - asking for central feature');
  const response2 = await openAICaller.call(prompt2(response1));

  console.log(`Idea of edtech b2c application in 2025 : ${response1}`);
  console.log(`Central feature to focus on : ${response2}`);
  return response2;
}

export const promptChainingUseCase = async ({ openAICaller }: { openAICaller: OpenAICaller }) => {
  const prompt1 = `
  Give me the most promising idea in edTech b2c web application I can make in 2025 in France,
  taking into account country culture and policies evolution.
  Give me only the idea, no other text.
  `;
  const prompt2 = (response1: string) => `I want to do this application : ${response1}. Give me details on the central feature to focus on.
  `;

  return _promptChainingUseCase({ openAICaller }, { prompt1, prompt2 });
}