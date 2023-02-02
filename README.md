# Yet Another HTTP - My own NodeJS REST API implementation

I don't like express.js. This is too weak HTTP framework for building serious projects. It is even not available to read
POST data out of box.

I decided to write my own HTTP server implementation that allows get most features (reading POST data, context and so
on) without installing any HTTP framework.

## Docs Site

https://yah.congritta.com

## Requirements

- Node.JS v18;
- Yarn

## At the moment, my implementation\`s features:

* Built on native node http server;
* Written in Typescript;
* Various HTTP servers with instances of Server class;
* Middleware support;
* Context over middlewares and handlers support;
* Custom Request and Response objects with only needed stuff;
* Can read POST data out of box. _JSON_, _multipart/form-data_, _urlencoded_ supported;
* Plugin API;
* Built-in error handling;
* Source code is covered by tests (jest.js);
* Automatic minimizes (on production) and prettify (on development) JSON HTTP responses

## How to install

`yarn add yet-another-http`

## Server example

```typescript
import Server, {Response} from "yet-another-http";

const server = new Server(8000);

server.on("GET", "/", () => {
  return new Response(200, "Hello World");
});

server.run().then(() => {
  console.log(`HTTP Server started at http://${server.host}:${server.port}`);
});
```
