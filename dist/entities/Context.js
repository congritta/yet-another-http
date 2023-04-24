"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
class Context {
    method;
    path;
    data = new Map();
    headers;
    ip;
    queryParams;
    constructor(request, ip, fields, files) {
        this.method = request.method.toUpperCase();
        this.path = request.url.replace(/\w(\/)$/i, "").split("?")[0];
        this.headers = request.headers;
        this.ip = ip;
        this._fields = fields;
        this._files = files;
        const queryString = request.url.split("?")[1];
        this.queryParams = queryString ? qs_1.default.parse(queryString) : {};
    }
    _fields;
    get fields() {
        return this._fields;
    }
    _files;
    get files() {
        return this._files;
    }
    _isParsed = false;
    get isParsed() {
        return this._isParsed;
    }
    setFields(fields) {
        this._fields = fields;
    }
    setFiles(files) {
        this._files = files;
    }
    setIsParsed() {
        this._isParsed = true;
    }
    _responseHeaders = {};
    get responseHeaders() {
        return this._responseHeaders;
    }
    setResponseHeaders(headers) {
        this._responseHeaders = headers;
    }
}
exports.default = Context;
//# sourceMappingURL=Context.js.map