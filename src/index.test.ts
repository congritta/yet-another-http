import {afterAll, beforeAll, expect} from "@jest/globals";
import axios from "axios";
import Response from "./entities/Response";
import Server from "./index";

const host = "127.0.0.1";
const port = 8001;

const axiosInstance = axios.create({
  baseURL: `http://${host}:${port}`,
});

let yah: Server;

describe("Main tests", () => {
  yah = new Server(port, host);

  beforeAll(async() => await yah.run());
  afterAll(() => yah.shutdown());

  // Test simple server
  test("GET /", async() => {
    yah.on("GET", "/", () => {
      return new Response(200, "OK");
    });

    const response = await axiosInstance.get("/");
    expect(response.status).toBe(200);
  });

  // Test custom path
  test("GET /a", async() => {
    yah.on("GET", "/a", () => {
      return new Response(200, "OK");
    });

    const response = await axiosInstance.get("/a");
    expect(response.status).toBe(200);
  });

  // Test get parameters
  test("GET /queryParams?a=2&b=3", async() => {

    let queryParams;

    yah.on("GET", "/queryParams", (context) => {
      return new Response(200, queryParams = context.queryParams);
    });

    const response = await axiosInstance.get("/queryParams?a=2&b=3");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.data).toStrictEqual(queryParams);
  });

  // Test middleware and context
  test("GET /middleware", async() => {

    yah.use((context) => {
      context.data.set("myProperty", 123);
    });

    yah.on("GET", "/middleware", (context) => {
      expect(context.data.get("myProperty")).toBe(123);
      return new Response(200, "OK");
    });

    const response = await axiosInstance.get("/middleware");
    expect(response.status).toBe(200);
  });

  // Test POST request
  test("POST /", async() => {

    const postData = {a: 1, b: 2};

    yah.on("POST", "/", (context) => {
      return new Response(200, JSON.stringify(context.fields), {
        "Content-Type": "application/json"
      });
    }, {});

    const response = await axiosInstance.post("/", postData);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.data).toStrictEqual(postData);
  });
});
