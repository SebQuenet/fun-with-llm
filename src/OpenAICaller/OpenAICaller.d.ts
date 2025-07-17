interface OpenAICaller {
  call(prompt: string): Promise<string>
}

export default OpenAICaller
