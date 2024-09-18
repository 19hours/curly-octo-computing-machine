import express from "express";
import { Readable } from "stream";

const app = express();
const port = 4001;

// Import 'compression' middleware to manage buffering (optional, if using)
import compression from "compression";

// Ensure that the compression middleware allows flushing
app.use(compression({ flush: true }));

app.get("/", (req, res) => {
  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  // Flush the headers immediately
  res.flushHeaders();

  // Counter to control the number of messages sent
  let i = 0;

  // Create a custom Readable stream that controls when to push data
  const customReadable = new Readable({
    read() {},
  });

  // Send the initial message
  customReadable.push("data: Basic Streaming Test\n\n");
  res.flush(); // Immediately flush the first message

  // Send a message every second
  const interval = setInterval(() => {
    if (i < 10) {
      customReadable.push(`data: ${i}\n\n`); // Send 0 to 9 as the message
      res.flush(); // Flush each message immediately
      i++;
    } else {
      // End the stream after 10 messages
      customReadable.push(null); // Signal the end of the stream
      clearInterval(interval);
    }
  }, 1000);

  // Pipe the readable stream into the response
  customReadable.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
