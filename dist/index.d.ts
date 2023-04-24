/// <reference types="node" />
import formidable from "formidable";
import http from "http";
import Context from "./entities/Context";
import Response from "./entities/Response";
import YahError from "./entities/YahError";
export type HTTP_METHODS = "GET" | "POST" | "PUT" | "DELETE";
export type MiddlewareResult = Response | null | void | Promise<MiddlewareResult>;
export type MiddlewareHandler = (request: Context) => MiddlewareResult;
export type ErrorHandler = (error: YahError, request: http.IncomingMessage, response: http.ServerResponse) => void;
export interface Middleware {
    slug: string | null;
    handler: MiddlewareHandler;
    formidableOptions?: formidable.Options;
}
export default class Server {
    readonly port: number;
    readonly host: string;
    readonly server: http.Server;
    private readonly middlewares;
    private onErrorHandler;
    constructor(port: number, host?: string);
    on(method: HTTP_METHODS, path: string, callback: MiddlewareHandler, formidableOptions?: formidable.Options): void;
    use(callback: MiddlewareHandler, formidableOptions?: formidable.Options): void;
    run(): Promise<void>;
    shutdown(): void;
    setOnErrorHandler(callback: ErrorHandler): void;
    private _doMiddleware;
    private _getPathFromUrl;
    private _generateSlug;
    private _parseSlug;
    private _onError;
}
export { default as Context } from "./entities/Context";
export { default as Response } from "./entities/Response";
//# sourceMappingURL=index.d.ts.map