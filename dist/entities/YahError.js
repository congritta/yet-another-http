"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEBUG = process.env.NODE_ENV !== "production";
class YahError extends Error {
    statusCode;
    errorMessage;
    request;
    response;
    constructor(errorMessage, statusCode = 500, request, response) {
        super(errorMessage);
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
        this.request = request;
        this.response = response;
    }
    responseWithError() {
        if (!this.response) {
            throw new Error("No response object provided");
        }
        this.response.statusCode = this.statusCode;
        this.response.setHeader("content-type", "text/plain");
        this.response.end(DEBUG || this.statusCode < 500 ? this.errorMessage : "A system error occurred");
    }
}
exports.default = YahError;
//# sourceMappingURL=YahError.js.map