import {ReadableStream} from "node:stream/web";

export function makeStream(generator: AsyncGenerator<boolean, void, unknown>): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream<any>({
    async start(controller) {
      for await (let chunk of generator) {
        const chunkData =  encoder.encode(JSON.stringify(chunk));
        controller.enqueue(chunkData);
      }
      controller.close();
    }
  });
}
