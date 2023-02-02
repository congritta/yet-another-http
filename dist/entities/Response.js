"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const stream_1 = require("stream");
const DEBUG = process.env.NODE_ENV !== "production";
class Response {
    constructor(statusCode, body, headers) {
        this.statusCode = statusCode;
        this.headers = new axios_1.AxiosHeaders(headers);
        this.contentType = "application/octet-stream";
        if (Buffer.isBuffer(body) || body instanceof stream_1.Readable) {
            this.body = stream_1.Readable.from(body);
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
        if (!this.headers.getContentType()) {
            this.headers.setContentType(this.contentType);
        }
    }
}
exports.default = Response;
