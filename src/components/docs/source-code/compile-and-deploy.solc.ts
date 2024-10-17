import { Checker, CompilerOutput } from '@/lib/interfaces'

export const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20 {
    constructor()
        ERC20("MyToken", "MTK")
    {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}`

export const checker: Checker = async (output: CompilerOutput) => {
  // check if mint function exists
  if (
    output.contracts['contract.sol']['MyToken'].abi.find(
      (item) => item.name === 'mint',
    ) === undefined
  ) {
    return [true, 'Function mint not found']
  }

  // check if mint function takes 2 arguments
  if (
    output.contracts['contract.sol']['MyToken'].abi.find(
      (item) => item.name === 'mint' && item.inputs.length !== 2,
    ) !== undefined
  ) {
    return [true, 'Function mint should take 2 arguments']
  }

  return [false, '']
}
