// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DynamicToken is ERC20, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public constant INITIAL_SUPPLY = 100000 * (10 ** 18);
    uint256 public baseTokenValue = 1 ether;

    struct Stakeholder {
        bool isRegistered;
        uint256 balance;
    }

    mapping(address => Stakeholder) public stakeholders;

    constructor() ERC20("DynamicToken", "DTOKEN") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // Calculate current token value based on supply and demand
    function getTokenValue() public view returns (uint256) {
        uint256 totalTokens = totalSupply();
        if (totalTokens == 0) {
            return baseTokenValue; // Avoid division by zero
        }
        return (address(this).balance * baseTokenValue) / totalTokens;
    }

    function getStakeholderTokenValue(address stakeholder) public view returns (uint256) {
        require(stakeholders[stakeholder].isRegistered, "Stakeholder not registered");
        
        uint256 stakeholderBalance = stakeholders[stakeholder].balance;
        uint256 totalTokens = totalSupply();
        if (stakeholderBalance == 0 || totalTokens == 0) {
            return baseTokenValue; // Avoid division by zero
        }
        return (address(this).balance * baseTokenValue) / stakeholderBalance;
    }

    // Register a stakeholder
    function registerStakeholder() public {
        require(!stakeholders[msg.sender].isRegistered, "Already registered");
        stakeholders[msg.sender].isRegistered = true;
    }

    // Reward a stakeholder with tokens
    function rewardStakeholder(address stakeholder, uint256 amount) public onlyOwner {
        require(stakeholders[stakeholder].isRegistered, "Stakeholder not registered");
        require(balanceOf(owner()) >= amount, "Insufficient token balance");

        // Transfer tokens to the stakeholder
        _transfer(owner(), stakeholder, amount);

        // Update stakeholder's balance
        stakeholders[stakeholder].balance += amount;
    }

    // Redeem tokens by a stakeholder
    function redeemTokens(uint256 amount) public {
        require(stakeholders[msg.sender].isRegistered, "Stakeholder not registered");
        require(stakeholders[msg.sender].balance >= amount, "Insufficient stakeholder balance");

        uint256 tokenValue = getTokenValue();
        uint256 rewardAmount = amount * tokenValue;

        // Transfer tokens back to the contract
        _transfer(msg.sender, address(this), amount);

        // Update stakeholder's balance
        stakeholders[msg.sender].balance -= amount;

        // Transfer reward (Ether) to the stakeholder
        payable(msg.sender).transfer(rewardAmount);
    }
        event MintingEvent(uint256 indexed tokenId, address indexed owner);

}
