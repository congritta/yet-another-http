/// <reference types="node" />
import formidable from "formidable";
import http, { IncomingHttpHeaders } from "http";
import { ParsedQs } from "qs";
export default class Request {
    readonly method: string;
    readonly path: string;
    readonly context: Map<any, any>;
    readonly headers: IncomingHttpHeaders;
    readonly ip: string;
    readonly queryParams: ParsedQs;
    constructor(request: http.IncomingMessage, ip: string, fields: formidable.Fields, files: formidable.Files);
    private _fields;
    get fields(): formidable.Fields;
    private _files;
    get files(): formidable.Files;
    private _isParsed;
    get isParsed(): boolean;
    setFields(fields: formidable.Fields): void;
    setFiles(files: formidable.Files): void;
    setIsParsed(): void;
}
