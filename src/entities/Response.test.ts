import {describe, expect} from "@jest/globals";
import * as fs from "fs";
import * as stream from "stream";
import Response from "./Response";

const fileToTest = "/etc/os-release";

describe("Test Response object", () => {

  test("A regular Response object", () => {

    // Send simple 'OK' message
    let response = new Response(200, "OK");
    expect(response.body).toStrictEqual(Buffer.from("OK"));
    expect(response.statusCode).toBe(200);
    expect(response.headers.getContentType()).toBe("text/plain");

    // Send number
    response = new Response(201, 123);
    expect(response.body).toStrictEqual(Buffer.from(JSON.stringify(123)));
    expect(response.statusCode).toBe(201);
    expect(response.headers.getContentType()).toBe("application/json");

    // Send and object (should be transformed to JSON)
    response = new Response(200, {a: 1, b: 2});
    expect(response.body).toStrictEqual(Buffer.from(JSON.stringify({a: 1, b: 2}, null, 2)));
    expect(response.statusCode).toBe(200);
    expect(response.headers.getContentType()).toBe("application/json");

    // Send a string and custom header
    response = new Response(200, "OK", {"x-custom-header": "myValue"});
    expect(response.body).toStrictEqual(Buffer.from("OK"));
    expect(response.statusCode).toBe(200);
    expect(response.headers.getContentType()).toBe("text/plain");
    expect(response.headers.get("x-custom-header")).toBe("myValue");

    // Send file (any readable stream)
    response = new Response(200, fs.createReadStream(fileToTest));
    expect(response.body).toBeInstanceOf(stream.Readable);
    expect(response.statusCode).toBe(200);
    expect(response.headers.getContentType()).toBe("application/octet-stream");

    // Set custom headers
    response = new Response(200, JSON.stringify({a: 1, b: 2}), {"content-type": "application/json"});
    expect(response.body).toStrictEqual(Buffer.from(JSON.stringify({a: 1, b: 2})));
    expect(response.statusCode).toBe(200);
    expect(response.headers.getContentType()).toBe("application/json");
  });
});
