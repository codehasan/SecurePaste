// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SecurePaste is Ownable {
    event NewPaste(bytes32 indexed id, address indexed sender);
    event PasteDeleted(bytes32 indexed id, address indexed sender);
    event PasteUpdated(bytes32 indexed id, address indexed sender);
    event PasteOwnershipTransferred(bytes32 indexed id, address indexed sender, address indexed newOwner);
    event NewPasteCooldownUpdated(uint256 oldTime, uint256 newTime);
    event UserPasteLimitUpdated(uint256 oldLimit, uint256 newLimit);

    enum PasteErrorCode {
        INVALLID_PASTE_ID,
        INVALID_PASTE_TITLE,
        INVALID_IPFS_HASH,
        INVALID_SYNTAX,
        INVALID_CURRENT_TIME,
        INVALID_NEW_PASTE_OWNER,
        NO_PASTE_FOUND,
        UNFINISHED_NEW_PASTE_COOLDOWN,
        USER_PASTE_LIMIT_EXCEEDED
    }

    error PasteCreateError(PasteErrorCode code, address sender);
    error PasteError(PasteErrorCode code, bytes32 id, address sender);
    error DangerousNewPasteCooldown();

    struct Paste {
        bytes32 id;
        uint256 timestamp;
        string title;
        string ipfsHash;
        string syntax;
    }

    uint256 private newPasteCooldown = 60;
    uint256 private userPasteLimit = 100;

    mapping(address => Paste[]) private ownedPastes;
    mapping(address => mapping(bytes32 => uint256)) private ownedPasteIndex;

    constructor() Ownable(msg.sender) {}

    function setUserPasteLimit(uint256 newLimit) external onlyOwner {
        uint256 oldLimit = userPasteLimit;
        userPasteLimit = newLimit;

        emit UserPasteLimitUpdated(oldLimit, newLimit);
    }

    function setNewPasteCooldown(uint256 newTime) external onlyOwner {
        if (newTime <= 15) {
            revert DangerousNewPasteCooldown();
        }

        uint256 oldTime = newPasteCooldown;
        newPasteCooldown = newTime;

        emit NewPasteCooldownUpdated(oldTime, newTime);
    }

    function transferPasteOwnership(bytes32 id, address newOwner) external {
        if (ownedPasteIndex[msg.sender][id] == 0) {
            revert PasteError(PasteErrorCode.NO_PASTE_FOUND, id, msg.sender);
        }

        if (newOwner == address(0) || newOwner == msg.sender) {
            revert PasteError(PasteErrorCode.INVALID_NEW_PASTE_OWNER, id, msg.sender);
        }

        _transferPasteOwnership(id, newOwner);
    }

    function createPaste(
        string calldata title,
        string calldata ipfsHash,
        string calldata syntax,
        uint256 currentTimeSeconds
    ) external {
        Paste[] storage pastes = ownedPastes[msg.sender];

        if (pastes.length > 0 && pastes[pastes.length - 1].timestamp + newPasteCooldown > block.timestamp) {
            revert PasteCreateError(PasteErrorCode.UNFINISHED_NEW_PASTE_COOLDOWN, msg.sender);
        }

        if (ownedPastes[msg.sender].length >= userPasteLimit) {
            revert PasteCreateError(PasteErrorCode.USER_PASTE_LIMIT_EXCEEDED, msg.sender);
        }

        bytes memory titleBytes = bytes(title);
        if (titleBytes.length < 4 || titleBytes.length > 100) {
            revert PasteCreateError(PasteErrorCode.INVALID_PASTE_TITLE, msg.sender);
        }

        bytes memory ipfsHashBytes = bytes(ipfsHash);
        if (ipfsHashBytes.length < 46 || ipfsHashBytes.length > 100) {
            revert PasteCreateError(PasteErrorCode.INVALID_IPFS_HASH, msg.sender);
        }

        bytes memory syntaxBytes = bytes(syntax);
        if (syntaxBytes.length < 1 || syntaxBytes.length > 30) {
            revert PasteCreateError(PasteErrorCode.INVALID_SYNTAX, msg.sender);
        }

        if (currentTimeSeconds == 0) {
            revert PasteCreateError(PasteErrorCode.INVALID_CURRENT_TIME, msg.sender);
        }

        bytes32 id = keccak256(abi.encode(title, ipfsHash, syntax, block.timestamp, msg.sender, currentTimeSeconds));

        _createPaste(id, title, ipfsHash, syntax);
    }

    function deletePaste(bytes32 id) external {
        if (id == bytes32(0)) {
            revert PasteError(PasteErrorCode.INVALLID_PASTE_ID, id, msg.sender);
        }

        if (ownedPasteIndex[msg.sender][id] == 0) {
            revert PasteError(PasteErrorCode.NO_PASTE_FOUND, id, msg.sender);
        }

        _deletePaste(id);
    }

    function updatePaste(bytes32 id, string calldata title, string calldata ipfsHash, string calldata syntax) external {
        if (ownedPasteIndex[msg.sender][id] == 0) {
            revert PasteError(PasteErrorCode.NO_PASTE_FOUND, id, msg.sender);
        }

        bytes memory titleBytes = bytes(title);
        if (titleBytes.length < 4 || titleBytes.length > 100) {
            revert PasteError(PasteErrorCode.INVALID_PASTE_TITLE, id, msg.sender);
        }

        bytes memory ipfsHashBytes = bytes(ipfsHash);
        if (ipfsHashBytes.length < 46 || ipfsHashBytes.length > 100) {
            revert PasteError(PasteErrorCode.INVALID_IPFS_HASH, id, msg.sender);
        }

        bytes memory syntaxBytes = bytes(syntax);
        if (syntaxBytes.length < 1 || syntaxBytes.length > 30) {
            revert PasteError(PasteErrorCode.INVALID_SYNTAX, id, msg.sender);
        }

        _updatePaste(id, title, ipfsHash, syntax);
    }

    function getPastes(uint256 count, uint256 skip) external view returns (Paste[] memory) {
        Paste[] storage pastes = ownedPastes[msg.sender];
        uint256 totalPastes = pastes.length;

        if (skip >= totalPastes) {
            return new Paste[](0);
        }

        uint256 availablePastes = totalPastes - skip;
        uint256 resultLength = count > availablePastes ? availablePastes : count;
        Paste[] memory result = new Paste[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = pastes[skip + i];
        }

        return result;
    }

    function getAllPaste() external view returns (Paste[] memory) {
        return ownedPastes[msg.sender];
    }

    function getTotalOwnedPasteCount() external view returns (uint256) {
        return ownedPastes[msg.sender].length;
    }

    function getPaste(bytes32 id) external view returns (Paste memory) {
        if (id == bytes32(0)) {
            revert PasteError(PasteErrorCode.INVALLID_PASTE_ID, id, msg.sender);
        }

        uint256 index = ownedPasteIndex[msg.sender][id];
        if (index == 0) {
            revert PasteError(PasteErrorCode.NO_PASTE_FOUND, id, msg.sender);
        }

        return ownedPastes[msg.sender][index - 1];
    }

    function _transferPasteOwnership(bytes32 id, address newOwner) private {
        Paste[] storage pastes = ownedPastes[msg.sender];
        uint256 index = ownedPasteIndex[msg.sender][id];
        uint256 arrayIndex = index - 1;
        uint256 lastIndex = pastes.length - 1;

        Paste storage paste = pastes[arrayIndex];

        ownedPastes[newOwner].push(
            Paste({
                id: paste.id,
                title: paste.title,
                ipfsHash: paste.ipfsHash,
                syntax: paste.syntax,
                timestamp: paste.timestamp
            })
        );
        ownedPasteIndex[newOwner][paste.id] = ownedPastes[newOwner].length;

        if (arrayIndex != lastIndex) {
            Paste storage lastPaste = pastes[lastIndex];
            pastes[arrayIndex] = lastPaste;
            ownedPasteIndex[msg.sender][lastPaste.id] = index;
        }

        pastes.pop();
        delete ownedPasteIndex[msg.sender][id];

        emit PasteOwnershipTransferred(id, msg.sender, newOwner);
    }

    function _createPaste(bytes32 id, string calldata title, string calldata ipfsHash, string calldata syntax) private {
        ownedPastes[msg.sender].push(
            Paste({id: id, title: title, ipfsHash: ipfsHash, syntax: syntax, timestamp: block.timestamp})
        );
        ownedPasteIndex[msg.sender][id] = ownedPastes[msg.sender].length;

        emit NewPaste(id, msg.sender);
    }

    function _deletePaste(bytes32 id) private {
        Paste[] storage pastes = ownedPastes[msg.sender];
        uint256 index = ownedPasteIndex[msg.sender][id];
        uint256 arrayIndex = index - 1;
        uint256 lastIndex = pastes.length - 1;

        if (arrayIndex != lastIndex) {
            Paste storage lastPaste = pastes[lastIndex];
            pastes[arrayIndex] = lastPaste;
            ownedPasteIndex[msg.sender][lastPaste.id] = index;
        }

        pastes.pop();
        delete ownedPasteIndex[msg.sender][id];

        emit PasteDeleted(id, msg.sender);
    }

    function _updatePaste(bytes32 id, string calldata title, string calldata ipfsHash, string calldata syntax) private {
        uint256 index = ownedPasteIndex[msg.sender][id];
        uint256 arrayIndex = index - 1;
        Paste storage paste = ownedPastes[msg.sender][arrayIndex];

        paste.title = title;
        paste.ipfsHash = ipfsHash;
        paste.syntax = syntax;

        emit PasteUpdated(id, msg.sender);
    }
}
