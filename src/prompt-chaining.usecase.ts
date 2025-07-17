import OpenAICaller from "./OpenAICaller/OpenAICaller";

export const promptChainingUseCase = async ({ openAICaller }: { openAICaller: OpenAICaller }) => {
  const prompt1 = `
  Give me the most promising idea in edTech b2c web application I can make in 2025 in France,
  taking into account country culture and policies evolution.
  Give me only the idea, no other text.
  `;
  console.log('first call - asking for business idea');
  const response1 = await openAICaller.call(prompt1);
  const prompt2 = `I want to do this application : ${response1}. Give me details on the central feature to focus on.
  `;

  console.log('second call - asking for central feature');
  const response2 = await openAICaller.call(prompt2);

  console.log(`Idea of edtech b2c application in 2025 : ${response1}`);
  console.log(`Central feature to focus on : ${response2}`);
  return response2;
}
