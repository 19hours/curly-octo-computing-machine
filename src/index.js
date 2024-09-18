import express from "express";
import compression from "compression"; // Import compression middleware

const app = express();
const port = 4001;

// Apply compression middleware globally
app.use(compression());

app.get("/", async (req, res) => {
  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Ensure headers are sent immediately

  // Stream data to the client
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    const message = `data: ${i}\n\n`; // Correct SSE format
    res.write(message); // Send data to the client
    res.flush(); // Ensure data is flushed immediately
  }

  // End the stream when done
  res.end();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
