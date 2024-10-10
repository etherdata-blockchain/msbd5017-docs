import { Checker, CompilerOutput } from '@/lib/interfaces'

export const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
  function hello() public pure returns (string memory) {
    return "Hello, World!";
  }
}
`

export const checker: Checker = async (output: CompilerOutput) => {
  if (output.contracts['contract.sol']['HelloWorld'] === undefined) {
    return [true, 'Contract HelloWorld not found']
  }

  // check if the contract has a function called hello
  const helloFunction = output.contracts['contract.sol']['HelloWorld'].abi.find(
    (item) => item.name === 'hello',
  )

  if (helloFunction === undefined) {
    return [true, 'Function hello not found']
  }

  return [false, '']
}
