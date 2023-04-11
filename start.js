require("dotenv/config");

console.log(process.env.npm_lifecycle_event)

const PORT = () => {
  const defaultPort = 3000;
  switch (process.env.npm_lifecycle_event) {
    case "dev": return +(process.env?.DEV_PORT || defaultPort);
    case "start": return +(process.env?.PROD_PORT || defaultPort);
    default: return defaultPort;
  };
};

const cli = require('next/dist/cli/next-start');
cli.nextStart(['-p', PORT()]);