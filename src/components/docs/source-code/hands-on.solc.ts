import { Checker, CompilerOutput } from '@/lib/interfaces'

export const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HandsOnExample {
  // define public a uint variable
  // define public a mapping
  // define a struct called Person and a function to return it (pure)
  // define a function to add a new element to the mapping
  // define a pure function to return the sum of two numbers
  // define a payable function to receive ether
}
`

export const solution = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HandsOnExample {
    // define public a uint variable
    uint256 public myNumber;

    // define public a mapping
    mapping(address => uint256) public balances;

    // define a struct called Person and a function to return it (pure)
    struct Person {
        string name;
        uint256 age;
    }

    function getPerson() public pure returns (Person memory) {
        return Person("John Doe", 30);
    }

    // define a function to add a new element to the mapping
    function addBalance(address account, uint256 amount) public {
        balances[account] += amount;
    }

    // define a pure function to return the sum of two numbers
    function sum(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    // define a payable function to receive ether
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
}
`

export const checker: Checker = async (output: CompilerOutput) => {
  // Check if the contract HandsOnExample exists
  if (output.contracts['contract.sol']['HandsOnExample'] === undefined) {
    return [true, 'HandsOnExample contract does not exist']
  }

  const abi = output.contracts['contract.sol']['HandsOnExample'].abi

  // Check for a public uint variable
  if (
    !abi.some(
      (item) =>
        item.type === 'function' &&
        item.stateMutability === 'view' &&
        item.outputs.length === 1 &&
        item.outputs[0].type === 'uint256',
    )
  ) {
    return [true, 'Public uint variable not found']
  }

  // Check for a public mapping
  if (
    !abi.some(
      (item) =>
        item.type === 'function' &&
        item.stateMutability === 'view' &&
        item.inputs.length === 1 &&
        item.outputs.length === 1,
    )
  ) {
    return [true, 'Public mapping not found']
  }

  // Check for a function to add an element to the mapping
  if (
    !abi.some(
      (item) =>
        item.type === 'function' &&
        item.stateMutability === 'nonpayable' &&
        item.inputs.length === 2,
    )
  ) {
    return [true, 'Function to add an element to the mapping not found']
  }

  // Check for a struct called Person
  console.log(abi)
  if (
    !abi.some(
      (item) =>
        item.type === 'function' &&
        item.stateMutability === 'pure' &&
        item.outputs.length === 1 &&
        item.outputs[0].type === 'tuple' &&
        item.outputs[0].internalType === 'struct HandsOnExample.Person',
    )
  ) {
    return [true, 'Struct called Person not found']
  }

  // Check for a pure function to return the sum of two numbers
  if (
    !abi.some(
      (item) =>
        item.type === 'function' &&
        item.stateMutability === 'pure' &&
        item.inputs.length === 2 &&
        item.outputs.length === 1,
    )
  ) {
    return [true, 'Pure function to return the sum of two numbers not found']
  }

  // Check for a payable function
  if (
    !abi.some(
      (item) => item.type === 'function' && item.stateMutability === 'payable',
    )
  ) {
    return [true, 'Payable function not found']
  }

  return [false, '']
}
