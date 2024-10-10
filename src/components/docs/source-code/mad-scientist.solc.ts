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

export const solution = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFGT is IERC20 {
    function mint(address _to, uint256 _amount) external returns (bool);
}

contract FGT is ERC20, Ownable {
    address public lockContract;
    uint256 public constant REDEMPTION_DATE = 2082844800; // Unix timestamp for Jan 1, 2036

    constructor() ERC20("FGT Token", "FGT") {
        lockContract = msg.sender; // Initially set to the deployer, should be updated to Lock contract
    }
    
    function setLockContract(address _lockContract) external onlyOwner {
        lockContract = _lockContract;
    }
    
    function mint(address _to, uint256 _amount) external returns (bool) {
        require(msg.sender == lockContract, "Only Lock contract can mint");
        _mint(_to, _amount);
        return true;
    }
    
    function redeem(uint256 _amount) external onlyOwner {
        require(block.timestamp >= REDEMPTION_DATE, "Redemption not allowed before 2036");
        _burn(msg.sender, _amount);
        // Implement redemption logic here (e.g., transfer AXC from Lock contract)
    }
    
    function transfer(address _recipient, uint256 _amount) public virtual override returns (bool) {
        require(block.timestamp >= REDEMPTION_DATE, "Transfers not allowed before 2036");
        return super.transfer(_recipient, _amount);
    }
    
    function transferFrom(address _sender, address _recipient, uint256 _amount) public virtual override returns (bool) {
        require(block.timestamp >= REDEMPTION_DATE, "Transfers not allowed before 2036");
        return super.transferFrom(_sender, _recipient, _amount);
    }
}

contract Lock is Ownable {
    uint256 public constant DEPOSIT_COST = 10 ether; // 10 AXC
    uint256 public constant DEPOSIT_LIMIT = 100 ether; // 100 AXC
    
    uint256 public totalDeposits;
    IFGT public fgtToken; // Use the new interface
    
    event Deposited(address indexed user, uint256 amount);
    
    constructor(address _fgtTokenAddress) {
        fgtToken = IFGT(_fgtTokenAddress);
    }
    
    function lockAXC() external payable {
        require(msg.value == DEPOSIT_COST, "Must deposit exactly 10 AXC");
        require(totalDeposits + msg.value <= DEPOSIT_LIMIT, "Deposit limit reached");
        
        totalDeposits += msg.value;
        
        // Mint 1 FGT token for each AXC deposited
        require(fgtToken.mint(msg.sender, msg.value), "Failed to mint FGT tokens");
        
        emit Deposited(msg.sender, msg.value);
    }
    
    function withdrawAXC(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }
}
`

export const checker: Checker = async (output) => {
  return [false, '']
}
