"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const DEBUG = process.env.NODE_ENV !== "production";
class Response {
    body;
    statusCode;
    headers;
    contentType;
    constructor(statusCode, body, headers) {
        this.statusCode = statusCode;
        this.headers = headers ?? {};
        this.contentType = "application/octet-stream";
        if (Buffer.isBuffer(body) || body instanceof stream_1.Readable) {
            this.body = body;
        }
        else if (typeof body === "string") {
            this.contentType = "text/plain";
            this.body = Buffer.from(body);
        }
        else if (["object", "number"].includes(typeof body) || body === null) {
            this.contentType = "application/json";
            this.body = Buffer.from(DEBUG ? JSON.stringify(body, null, 2) : JSON.stringify(body));
        }
        else {
            throw new Error("Unsupported data type");
        }
        if (!('content-type' in this.headers)) {
            this.headers['content-type'] = this.contentType;
        }
    }
}
exports.default = Response;
//# sourceMappingURL=Response.js.map