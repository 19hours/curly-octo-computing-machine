const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Custom Express route
  server.get("/api/custom-route", (req, res) => {
    res.json({ message: "Hello from Express!" });
  });

  server.get("/api/test400", (req, res) => {
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

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
