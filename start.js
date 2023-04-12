require("dotenv/config");

const prodCli = require('next/dist/cli/next-start');
const devCli = require('next/dist/cli/next-dev');
const defaultPort = 3000;

console.log(process.env.npm_lifecycle_event)

if (process.env.npm_lifecycle_event === "dev") {
  return devCli.nextDev(["-p", +(process.env?.DEV_PORT || defaultPort)]);
} else if (process.env.npm_lifecycle_event === "start") {
  return prodCli.nextStart(["-p", +(process.env?.PROD_PORT || defaultPort)]);
};