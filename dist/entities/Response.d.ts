/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import http from "http";
import { Readable } from "stream";
export default class Response {
    readonly body: Buffer | Readable;
    readonly statusCode: number;
    readonly headers: {
        [key: string]: string;
    };
    readonly contentType: http.IncomingHttpHeaders["content-type"];
    constructor(statusCode: number, body: string | number | object | Buffer | Readable, headers?: {
        [key: string]: string;
    });
}
//# sourceMappingURL=Response.d.ts.map