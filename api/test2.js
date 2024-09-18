import express from "express";

const app = express();

// Example: Express route
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Express inside Next.js!" });
});

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

// Express error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export const GET = (req, res) => {
  // Mount the Express app inside the Next.js API handler
  return new Promise((resolve, reject) => {
    app(req, res, (finalErr) => {
      if (finalErr) reject(finalErr);
      else resolve();
    });
  });
};
