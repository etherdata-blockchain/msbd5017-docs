import React from "react";
import Terminal from "react-animated-term";
import "react-animated-term/dist/react-animated-term.css";

const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const termLines = [
  {
    text: "npx hardhat run scripts/deploy.ts --network etherdata",
    cmd: true,
    delay: 80,
  },
  {
    text: "Contract deployed to: SOME_CONTRACT_ADDRESS",
    cmd: false,
    repeat: true,
    repeatCount: 1,
    frames: spinner.map(function (spinner) {
      return {
        text: spinner + "Deploying contract...",
        delay: 40,
      };
    }),
  },
];

export default function DeployContract() {
  return <Terminal lines={termLines} interval={100} height={300} />;
}
