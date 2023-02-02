"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.Request = void 0;
const formidable_1 = __importDefault(require("formidable"));
const http_1 = __importDefault(require("http"));
const stream_1 = require("stream");
const Request_1 = __importDefault(require("./entities/Request"));
const Response_1 = __importDefault(require("./entities/Response"));
const YahError_1 = __importDefault(require("./entities/YahError"));
class Server {
    constructor(port, host = "127.0.0.1") {
        this.middlewares = [];
        this.onErrorHandler = null;
        this.port = port;
        this.host = host;
        this.server = http_1.default.createServer((request, response) => {
            try {
                const $request = new Request_1.default(request, request.headers["x-forwarded-for"] ?? request.socket.remoteAddress ?? null, {}, {});
                this._doMiddleware(0, $request, request, response);
            }
            catch (error) {
                this._onError(error, request, response);
            }
        });
    }
    on(method, path, callback, formidableOptions) {
        if (!http_1.default.METHODS.includes(method)) {
            throw new Error("Unsupported http method");
        }
        this.middlewares.push({
            slug: this._generateSlug(method, path),
            handler: callback,
            formidableOptions
        });
    }
    use(callback, formidableOptions) {
        this.middlewares.push({
            slug: null,
            handler: callback,
            formidableOptions: formidableOptions
        });
    }
    run() {
        return new Promise((resolve) => {
            this.server.listen(this.port, this.host, resolve);
        });
    }
    shutdown() {
        this.server.close();
    }
    setOnErrorHandler(callback) {
        this.onErrorHandler = callback;
    }
    _doMiddleware(i, $request, request, response) {
        const handleMiddleware = (middlewareResult) => {
            if (middlewareResult instanceof Response_1.default) {
                response.statusCode = middlewareResult.statusCode;
                for (const [header, headerValue] of Object.entries(middlewareResult.headers)) {
                    if (headerValue) {
                        response.setHeader(header, headerValue);
                    }
                }
                if (middlewareResult.body instanceof stream_1.Readable) {
                    middlewareResult.body.pipe(response);
                }
                else {
                    return response.end(middlewareResult.body);
                }
            }
            else if (middlewareResult === null) {
                return;
            }
            this._doMiddleware(i + 1, $request, request, response);
        };
        const middleware = this.middlewares[i];
        if (!middleware) {
            throw new YahError_1.default("Middleware not found", 404, request, response);
        }
        if (!middleware.slug || this._parseSlug(middleware.slug).method === request.method && this._parseSlug(middleware.slug).path === this._getPathFromUrl(request.url)) {
            if (["POST", "PUT"].includes(request.method) && !$request.isParsed && middleware.formidableOptions) {
                (new formidable_1.default.IncomingForm(middleware.formidableOptions)).parse(request, (error, fields, files) => {
                    if (error) {
                        throw error;
                    }
                    $request.setFields(fields);
                    $request.setFiles(files);
                    $request.setIsParsed();
                    const middlewareResult = middleware.handler($request);
                    if (middlewareResult instanceof Promise) {
                        middlewareResult.then(handleMiddleware);
                    }
                    else {
                        handleMiddleware(middlewareResult);
                    }
                });
            }
            else {
                const middlewareResult = middleware.handler($request);
                if (middlewareResult instanceof Promise) {
                    middlewareResult.then(handleMiddleware);
                }
                else {
                    handleMiddleware(middlewareResult);
                }
            }
        }
        else {
            this._doMiddleware(i + 1, $request, request, response);
        }
    }
    _getPathFromUrl(url) {
        return url.replace(/\w(\/)$/i, "").split("?")[0];
    }
    _generateSlug(method, url) {
        return `${method.toUpperCase()} ${this._getPathFromUrl(url)}`;
    }
    _parseSlug(slug) {
        const [method, path] = slug.split(" ");
        return { method, path };
    }
    _onError(error, request, response) {
        let $error;
        if (error instanceof YahError_1.default) {
            $error = error;
        }
        else if (error instanceof Error) {
            $error = new YahError_1.default(error.message, 500, request, response);
        }
        else {
            $error = new YahError_1.default("An error occurred", 500, request, response);
        }
        if ($error.response) {
            $error.responseWithError();
        }
        this.onErrorHandler?.($error, request, response);
    }
}
exports.default = Server;
var Request_2 = require("./entities/Request");
Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return __importDefault(Request_2).default; } });
var Response_2 = require("./entities/Response");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return __importDefault(Response_2).default; } });
