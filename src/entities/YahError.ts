/*
 * Copyright (c) 2023. Alex Congritta
 *
 * E-Mail: congritta@gmail.com
 * WebSite: https://congritta.com
 */

import http from "http";

const DEBUG = process.env.NODE_ENV !== "production";

export default class YahError extends Error {

  readonly statusCode: number;
  readonly errorMessage: string;
  readonly request?: http.IncomingMessage;
  readonly response?: http.ServerResponse;

  constructor(errorMessage: string, statusCode = 500, request?: http.IncomingMessage, response?: http.ServerResponse) {
    super(errorMessage);

    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
    this.request = request;
    this.response = response;
  }

  responseWithError() {
    if(!this.response) {
      throw new Error("No response object provided");
    }

    this.response.statusCode = this.statusCode;
    this.response.setHeader("content-type", "text/plain");
    this.response.end(DEBUG || this.statusCode < 500 ? this.errorMessage : "A system error occurred");
  }

}
