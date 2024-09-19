import { Readable } from "stream";

export default async function handler(req, res) {
  // Create a readable stream
  const stream = new Readable({
    async read() {
      this.push("Basic Streaming Test\n"); // Initial message

      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

        const message = `data: ${i}\n\n`; // SSE format
        this.push(message); // Push each message to the stream
      }

      this.push(null); // End the stream
    },
  });

  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Pipe the readable stream to the response
  stream.pipe(res);
}
