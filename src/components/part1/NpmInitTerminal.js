import React from "react";
import Terminal from "react-animated-term";
import "react-animated-term/dist/react-animated-term.css";

const termLines = [
  {
    text: "npm init -y",
    cmd: true,
  },
  {
    text: `Wrote to test/package.json:
{
  "name": "test",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
    `,
    cmd: false,
  },
];

export default function NpmInitTerminal() {
  return <Terminal lines={termLines} interval={100} height={340} />;
}
