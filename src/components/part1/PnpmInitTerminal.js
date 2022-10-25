import React from "react";
import Terminal from "react-animated-term";
import "react-animated-term/dist/react-animated-term.css";

const termLines = [
  {
    text: "pnpm init",
    cmd: true,
  },
  {
    text: `Wrote to /Users/sirily11/Desktop/test/package.json

    {
      "name": "test",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC"
    }`,
    cmd: false,
  },
];

export default function PnpmInitTerminal() {
  return <Terminal lines={termLines} interval={100} height={340} />;
}
