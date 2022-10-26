import React from "react";
import Terminal from "react-animated-term";
import "react-animated-term/dist/react-animated-term.css";

const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const termLines = [
  {
    text: "npx hardhat test",
    cmd: true,
    delay: 80,
  },
  {
    text: "Compiled 6 Solidity files successfully",
    cmd: false,
  },
  {
    text: "Given MyToken",
    cmd: false,
  },
  {
    text: "✔ Owner should get the initial supply (1288ms)",
    cmd: false,
    repeat: true,
    repeatCount: 1,
    frames: spinner.map(function (spinner) {
      return {
        text: spinner + "Owner should get the initial supply",
        delay: 40,
      };
    }),
  },
  {
    text: "",
    cmd: true,
  },
];

export default function TestHardHat() {
  return <Terminal lines={termLines} interval={100} height={300} />;
}
