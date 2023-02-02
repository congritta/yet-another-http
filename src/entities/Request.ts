/*
 * Copyright (c) 2023. Alex Congritta
 *
 * E-Mail: congritta@gmail.com
 * WebSite: https://congritta.com
 */

import formidable from "formidable";
import http, {IncomingHttpHeaders} from "http";
import qs, {ParsedQs} from "qs";

export default class Request {
  readonly method: string;
  readonly path: string;
  readonly context = new Map();
  readonly headers: IncomingHttpHeaders;
  readonly ip: string;
  readonly queryParams: ParsedQs;

  constructor(request: http.IncomingMessage, ip: string, fields: formidable.Fields, files: formidable.Files) {
    this.method = (request.method as string).toUpperCase();
    this.path = (request.url as string).replace(/\w(\/)$/i, "").split("?")[0];
    this.headers = request.headers;
    this.ip = ip;
    this._fields = fields;
    this._files = files;

    const queryString: string|undefined = (request.url as string).split("?")[1];
    this.queryParams = queryString ? qs.parse(queryString) : {};
  }

  private _fields: formidable.Fields;

  get fields(): formidable.Fields {
    return this._fields;
  }

  private _files: formidable.Files;

  get files(): formidable.Files {
    return this._files;
  }

  private _isParsed = false;

  get isParsed() {
    return this._isParsed;
  }

  setFields(fields: formidable.Fields) {
    this._fields = fields;
  }

  setFiles(files: formidable.Files) {
    this._files = files;
  }

  setIsParsed() {
    this._isParsed = true;
  }
}
