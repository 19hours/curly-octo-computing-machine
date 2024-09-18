export const config = {
  runtime: "edge",
};

export async function GET() {
  // This encoder will stream your text
  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      // Start encoding 'Basic Streaming Test',
      // and add the resulting stream to the queue
      controller.enqueue(encoder.encode("Basic Streaming Test"));
      // Prevent anything else being added to the stream
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
        const message = `data: ${i}\n\n`; // Correct SSE format
        controller.enqueue(encoder.encode(message));
      }
      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
