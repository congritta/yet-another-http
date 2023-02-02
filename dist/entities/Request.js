"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
class Request {
    constructor(request, ip, fields, files) {
        this.context = new Map();
        this._isParsed = false;
        this.method = request.method.toUpperCase();
        this.path = request.url.replace(/\w(\/)$/i, "").split("?")[0];
        this.headers = request.headers;
        this.ip = ip;
        this._fields = fields;
        this._files = files;
        const queryString = request.url.split("?")[1];
        this.queryParams = queryString ? qs_1.default.parse(queryString) : {};
    }
    get fields() {
        return this._fields;
    }
    get files() {
        return this._files;
    }
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
}
exports.default = Request;
