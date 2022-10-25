import React from "react";
import Terminal from "react-animated-term";
import "react-animated-term/dist/react-animated-term.css";

const termLines = [
  {
    text: "mkdir test",
    cmd: true,
  },
  {
    text: "cd test",
    cmd: true,
  },
];

export default function InstallNodeTerminal() {
  return <Terminal lines={termLines} interval={100} />;
}
