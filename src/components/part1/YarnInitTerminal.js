import React from "react";
import Terminal from "react-animated-term";
import "react-animated-term/dist/react-animated-term.css";

const termLines = [
  {
    text: "yarn init -y",
    cmd: true,
  },
  {
    text: `yarn init v1.22.19
    warning The yes flag has been set. This will automatically answer yes to all questions, which may have security implications.
    success Saved package.json
    ✨  Done in 0.01s.
    `,
    cmd: false,
  },
];

export default function YarnInitTerminal() {
  return <Terminal lines={termLines} interval={100} height={340} />;
}
