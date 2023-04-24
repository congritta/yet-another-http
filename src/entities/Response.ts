/*
 * Copyright (c) 2023. Alex Congritta
 *
 * E-Mail: congritta@gmail.com
 * WebSite: https://congritta.com
 */

import http from "http";
import {Readable} from "stream";

const DEBUG = process.env.NODE_ENV !== "production";

export default class Response {
  readonly body: Buffer|Readable;
  readonly statusCode: number;
  readonly headers: {[key: string]: string};
  readonly contentType: http.IncomingHttpHeaders["content-type"];

  constructor(statusCode: number, body: string|number|object|Buffer|Readable, headers?: {[key: string]: string}) {
    this.statusCode = statusCode;
    this.headers = headers ?? {};
    this.contentType = "application/octet-stream";

    if(Buffer.isBuffer(body) || body instanceof Readable) {
      this.body = Readable.from(body);
    }
    else if(typeof body === "string") {
      this.contentType = "text/plain";
      this.body = Buffer.from(body);
    }
    else if(["object", "number"].includes(typeof body) || body === null) {
      this.contentType = "application/json";
      this.body = Buffer.from(DEBUG ? JSON.stringify(body, null, 2) : JSON.stringify(body));
    }
    else {
      throw new Error("Unsupported data type");
    }

    if(!('content-type' in this.headers)) {
      this.headers['content-type'] = this.contentType;
    }
  }
}
