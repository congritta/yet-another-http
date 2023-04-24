/// <reference types="node" />
import http from "http";
export default class YahError extends Error {
    readonly statusCode: number;
    readonly errorMessage: string;
    readonly request?: http.IncomingMessage;
    readonly response?: http.ServerResponse;
    constructor(errorMessage: string, statusCode?: number, request?: http.IncomingMessage, response?: http.ServerResponse);
    responseWithError(): void;
}
//# sourceMappingURL=YahError.d.ts.map