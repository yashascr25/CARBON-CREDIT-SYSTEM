// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCredit is ERC20, Ownable {
    uint256 public carbonOffsetRate = 10; // 10 tokens = 1 ton CO2 offset

    event CreditsIssued(address indexed to, uint256 amount);
    event CreditsRetired(address indexed from, uint256 amount);
    event CarbonOffsetted(address indexed user, uint256 tons, uint256 tokensUsed);

    constructor() ERC20("CarbonCredit", "CO2C") Ownable(msg.sender) {} 

    function issueCredits(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit CreditsIssued(to, amount);
    }

    function retireCredits(uint256 amount) public {
        _burn(msg.sender, amount);
        emit CreditsRetired(msg.sender, amount);
    }

    function offsetCarbon(address user, uint256 tons) public onlyOwner {
        uint256 requiredTokens = tons * carbonOffsetRate;
        _burn(user, requiredTokens);
        emit CarbonOffsetted(user, tons, requiredTokens);
    }
}
