/*
 * Copyright (c) 2023. Alex Congritta
 *
 * E-Mail: congritta@gmail.com
 * WebSite: https://congritta.com
 */

import formidable from "formidable";
import http from "http";
import {Readable} from "stream";
import Context from "./entities/Context";
import Response from "./entities/Response";
import YahError from "./entities/YahError";

export type HTTP_METHODS = "GET" | "POST" | "PUT" | "DELETE"
export type MiddlewareResult = Response | null | void | Promise<MiddlewareResult>
export type MiddlewareHandler = (request: Context) => MiddlewareResult
export type ErrorHandler = (error: YahError, request: http.IncomingMessage, response: http.ServerResponse) => void

export interface Middleware {
  slug: string | null,
  handler: MiddlewareHandler,
  formidableOptions?: formidable.Options
}

export default class Server {
  readonly port: number;
  readonly host: string;
  readonly server: http.Server;
  private readonly middlewares: Middleware[] = [];
  private onErrorHandler: ErrorHandler | null = null;

  constructor(port: number, host = "127.0.0.1") {
    this.port = port;
    this.host = host;

    // Create main handler
    this.server = http.createServer((request, response) => {
      try {

        // Build a Context object
        const $context = new Context(
          request,
          request.headers["x-forwarded-for"] as string ?? request.socket.remoteAddress ?? null,
          {},
          {}
        );

        // Handle request
        this._doMiddleware(0, $context, request, response);
      }
      catch(error) {
        this._onError(error, request, response);
      }
    });
  }

  on(method: HTTP_METHODS, path: string, callback: MiddlewareHandler, formidableOptions?: formidable.Options) {
    if(!http.METHODS.includes(method)) {
      throw new Error("Unsupported http method");
    }

    this.middlewares.push({
      slug: this._generateSlug(method, path),
      handler: callback,
      formidableOptions
    });
  }

  use(callback: MiddlewareHandler, formidableOptions?: formidable.Options) {
    this.middlewares.push({
      slug: null,
      handler: callback,
      formidableOptions: formidableOptions
    });
  }

  run() {
    return new Promise<void>((resolve) => {
      this.server.listen(this.port, this.host, resolve);
    });
  }

  shutdown() {
    this.server.close();
  }

  setOnErrorHandler(callback: ErrorHandler) {
    this.onErrorHandler = callback;
  }

  private _doMiddleware(i: number, $context: Context, request: http.IncomingMessage, response: http.ServerResponse) {
    const handleMiddleware = (middlewareResult: MiddlewareResult) => {

      // Handle regular Response object
      if(middlewareResult instanceof Response) {
        response.statusCode = middlewareResult.statusCode;

        /* Set headers */

        for(const [header, headerValue] of Object.entries($context.responseHeaders)) {
          if(headerValue) {
            response.setHeader(header, headerValue);
          }
        }

        for(const [header, headerValue] of Object.entries(middlewareResult.headers)) {
          if(headerValue) {
            response.setHeader(header, headerValue);
          }
        }

        // Send Response body
        if(middlewareResult.body instanceof Readable) {
          return middlewareResult.body.pipe(response);
        }
        else if(Buffer.isBuffer(middlewareResult.body)) {
          return Readable.from(middlewareResult.body).pipe(response);
        }
        else {
          return response.end(middlewareResult.body);
        }
      }

      // Stop running next middlewares if null returned
      else if(middlewareResult === null) {
        return;
      }

      // Run next middleware
      this._doMiddleware(i + 1, $context, request, response);
    };

    // Check if middleware exists
    const middleware = this.middlewares[i];

    if(!middleware) {
      throw new YahError("Middleware not found", 404, request, response);
    }

    // Do middleware
    if(!middleware.slug || (this._parseSlug(middleware.slug).method === request.method && this._parseSlug(middleware.slug).path === this._getPathFromUrl(
      request.url as string))) {

      // Handle requests with body
      if(["POST", "PUT"].includes(request.method as string) && !$context.isParsed && middleware.formidableOptions) {

        (new formidable.IncomingForm(middleware.formidableOptions)).parse(request, (error, fields, files) => {
          if(error) {
            throw error;
          }

          // Set request fields and files
          $context.setFields(fields);
          $context.setFiles(files);
          $context.setIsParsed();

          // Handle request (call it`s callback)
          const middlewareResult = middleware.handler($context);
          if(middlewareResult instanceof Promise) {
            middlewareResult.then(handleMiddleware).catch((error) => this._onError(error, request, response));
          }
          else {
            handleMiddleware(middlewareResult);
          }
        });
      }

      // Handle other requests
      else {

        // Handle request (call it`s callback)
        const middlewareResult = middleware.handler($context);
        if(middlewareResult instanceof Promise) {
          middlewareResult.then(handleMiddleware).catch((error) => this._onError(error, request, response));
        }
        else {
          handleMiddleware(middlewareResult);
        }
      }
    }

    // Run next middleware
    else {
      this._doMiddleware(i + 1, $context, request, response);
    }
  }

  private _getPathFromUrl(url: string) {
    return url.replace(/\w(\/)$/iu, "").split("?")[0];
  }

  private _generateSlug(method: string, url: string) {
    return `${method.toUpperCase()} ${this._getPathFromUrl(url)}`;
  }

  private _parseSlug(slug: string) {
    const [method, path] = slug.split(" ");
    return {method, path};
  }

  private _onError(error: unknown, request: http.IncomingMessage, response: http.ServerResponse) {

    let $error: YahError;

    if(error instanceof YahError) {
      $error = error;
    }
    else if(error instanceof Error) {
      $error = new YahError(error.message, 500, request, response);
    }
    else {
      $error = new YahError("An error occurred", 500, request, response);
    }

    if($error.response) {
      $error.responseWithError();
    }

    this.onErrorHandler?.($error, request, response);
  }

}

export {default as Context} from "./entities/Context";
export {default as Response} from "./entities/Response";
