export const HELLOWORLD_SOLC = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
  function hello() public pure returns (string memory) {
    return "Hello, World!";
  }
}
`
