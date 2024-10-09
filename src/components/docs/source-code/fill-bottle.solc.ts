import { Checker, CompilerOutput } from '@/lib/interfaces'

// fillBottle(uint256 amount)
export const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FillBotleGame {
    /**
     * @dev Fill the bottle with the given amount
     * @param amount to fill the bottle with
     */
    function fillBottle(uint256 amount) public {
       
    }

    /**
     * @dev Check the amount of water in the bottle
     * @return amount of water in the bottle
     */
    function checkBottle() public pure returns (uint256 amount) {
        return amount;
    }
}
`

export const checker: Checker = async (output: CompilerOutput) => {
  return [false, '']
}
