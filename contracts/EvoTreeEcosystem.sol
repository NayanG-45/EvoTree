// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EvoTreeEcosystem is ERC1155, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Stage 1: The Core
    uint256 public constant GENESIS_SEED = 0;
    
    // Stage 2: Identity Branches
    uint256 public constant GITHUB_BRANCH = 1;
    uint256 public constant CODEFORCES_ROOT = 2;
    uint256 public constant LEETCODE_VINE = 3;
    uint256 public constant KAGGLE_NODE = 4;

    // Stage 3 & 4: Relics & Milestones
    uint256 public constant HACKOFIESTA_RELIC = 99;

    constructor() ERC1155("https://api.evotree.com/metadata/{id}.json") {
        // You are the Super Admin
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // You are also an initial Issuer
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    /**
     * @dev Mints a specific Growth Node to a user's tree.
     * Only wallets with the ISSUER_ROLE (like your verified Next.js backend) can call this.
     */
    function mintNode(address account, uint256 id, uint256 amount) public onlyRole(ISSUER_ROLE) {
        _mint(account, id, amount, "");
    }

    /**
     * @dev OVERRIDE: This makes the tokens SOULBOUND.
     * Tokens can be minted (from address 0) but cannot be transferred between users.
     */
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override {
        require(from == address(0) || to == address(0), "EvoTree: Growth Nodes are Soulbound and cannot be transferred");
        super._update(from, to, ids, values);
    }

    /**
     * @dev Required override for AccessControl and ERC1155 standard.
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}