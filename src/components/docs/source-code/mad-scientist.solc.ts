import { Checker } from '@/lib/interfaces'

export const source = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {
    }
}
`

export const checker: Checker = async (output) => {
  return [false, '']
}
