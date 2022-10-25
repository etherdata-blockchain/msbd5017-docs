import React from "react";
import Terminal from "react-animated-term";
import "react-animated-term/dist/react-animated-term.css";

const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const termLines = [
  {
    text: "npx hardhat",
    cmd: true,
    delay: 80,
  },
  {
    text: `
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.12.0 👷‍`,
  },
  {
    text: "✔ What do you want to do? · Create a TypeScript project",
    cmd: false,
  },
  {
    text: "✔ Hardhat project root: · /test",
    cmd: false,
  },
  {
    text: "✔ Do you want to add a .gitignore? (Y/n) · y",
    cmd: false,
  },
  {
    text: "✔ Do you want to install this sample project's dependencies with npm (hardhat @nomicfoundation/hardhat-toolbox)? (Y/n) · y",
    cmd: false,
  },
  {
    text: "✔ Installed",
    cmd: false,
    repeat: true,
    repeatCount: 1,
    frames: spinner.map(function (spinner) {
      return {
        text:
          spinner +
          " npm install --save-dev hardhat@^2.12.0 @nomicfoundation/hardhat-toolbox@^2.0.0",
        delay: 40,
      };
    }),
  },
  {
    text: "",
    cmd: true,
  },
];

export default function InstallHardHat() {
  return <Terminal lines={termLines} interval={100} height={500} />;
}
