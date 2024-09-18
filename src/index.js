import express from "express";
import { Transform } from "stream"; // Import Node.js stream utilities

const app = express();
const port = 4001;

app.get("/", async (req, res) => {
  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Encoding", "none");

  // Create a Transform stream to handle the streaming of data
  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk);
    },
  });

  // Start streaming data to the client
  const streamData = async () => {
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between sending data
      const message = `data: ${i}\n\n`;
      transformStream.write(message); // Write data to the transform stream
    }

    transformStream.end(); // End the stream when done
  };

  try {
    await streamData(); // Start streaming
  } catch (error) {
    console.error("Error occurred during streaming", error);
    transformStream.write("data: An error occurred during streaming\n\n");
    transformStream.end();
  }

  // Pipe the transform stream to the response
  transformStream.pipe(res);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
