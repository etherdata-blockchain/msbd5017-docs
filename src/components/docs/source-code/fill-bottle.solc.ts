import { Checker, CompilerOutput } from '@/lib/interfaces'

// fillBottle(uint256 amount)
export const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FillBottleGame {
    /**
     * @dev Fill the bottle with the given amount
     */
    function fillBottle() public {
       
    }

    /**
     * @dev Check the amount of water in the bottle
     * @return amount of water in the bottle
     */
    function checkBottle() public view returns (uint256 amount) {
        return amount;
    }
}
`

export const checker: Checker = async (output: CompilerOutput) => {
  // check if the contract FillBottleGame exists
  if (output.contracts['contract.sol']['FillBottleGame'] === undefined) {
    return [true, 'FillBottleGame contract does not exist']
  }

  // check if the fillBottle function exists
  if (
    output.contracts['contract.sol']['FillBottleGame'].abi.find(
      (item) => item.name === 'fillBottle',
    ) === undefined
  ) {
    return [true, 'Function fillBottle not found']
  }

  // check if fillBottle takes no arguments
  console.log(output.contracts['contract.sol']['FillBottleGame'].abi)
  if (
    output.contracts['contract.sol']['FillBottleGame'].abi.find(
      (item) => item.name === 'fillBottle' && item.inputs.length !== 0,
    ) !== undefined
  ) {
    return [true, 'Function fillBottle should take no arguments']
  }

  // check if the checkBottle function exists
  if (
    output.contracts['contract.sol']['FillBottleGame'].abi.find(
      (item) => item.name === 'checkBottle',
    ) === undefined
  ) {
    return [true, 'Function checkBottle not found']
  }

  // check if the checkBottle function returns a uint256
  if (
    output.contracts['contract.sol']['FillBottleGame'].abi.find(
      (item) =>
        item.name === 'checkBottle' && item.outputs[0].type !== 'uint256',
    ) !== undefined
  ) {
    return [true, 'Function checkBottle should return a uint256']
  }

  return [false, '']
}
