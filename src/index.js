const express = require("express");

const app = express();
const port = 4001;

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Encoding", "none");
  res.flushHeaders();

  // Function to create a delay (simulate setTimeout with async/await)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Using a loop with async/await
  for (let i = 0; i < 10; i++) {
    await delay(1000); // Wait 1 second
    res.write(`data: ${i}\n\n`); // Send the data
  }

  res.end(); // End the stream after all messages have been sent
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
