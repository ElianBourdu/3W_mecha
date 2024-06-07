import {ReadableStream} from "node:stream/web";

export class StreamingResponse extends Response {
  constructor( res: ReadableStream<any>, init?: ResponseInit ) {
    super(res as any, {
      ...init,
      //
      status: 200,
      // copy headers to the "parent" response
      headers: { ...init?.headers },
    });
  }
}
