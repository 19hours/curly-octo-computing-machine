export const config = {
  supportsResponseStreaming: true,
};

export default function handler(request: Request, response: Response) {
  const { name = "World" } = request.query;
  return response.send(`Hello ${name}!`);
}
