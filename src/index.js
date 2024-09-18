import express from "express";
import { Readable } from "stream"; // Use Node.js Readable stream
import { TextEncoder } from "util"; // Use TextEncoder from Node.js

const app = express();
const port = 4001;

app.get("/", (req, res) => {
  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  // Use TextEncoder to encode the streamed messages
  const encoder = new TextEncoder();

  // Counter to control the number of messages sent
  let i = 0;

  // Create a custom Readable stream that controls when to push data
  const customReadable = new Readable({
    async read() {
      if (i === 0) {
        // Send the initial message
        this.push(encoder.encode("data: Basic Streaming Test\n\n"));
        i++;
      } else if (i <= 10) {
        // Send a message every second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const message = `data: ${i - 1}\n\n`; // Send 0 to 9 as the message
        this.push(encoder.encode(message)); // Push the message to the stream
        i++;
      } else {
        // End the stream after 10 messages
        this.push(null); // Signal the end of the stream
      }
    },
  });

  // Pipe the readable stream into the response
  customReadable.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
