/* eslint-disable */
/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  resolver: require.resolve(`jest-pnp-resolver`)
};
