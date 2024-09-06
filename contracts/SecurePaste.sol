// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SecurePaste is Ownable {
    event NewPaste(bytes32 indexed id, address indexed sender);
    event PasteDeleted(bytes32 indexed id, address indexed sender);
    event PasteUpdated(bytes32 indexed id, address indexed sender);
    event NewPasteCooldownUpdated(uint256 oldTime, uint256 newTime);
    event UserPasteLimitUpdated(uint256 oldLimit, uint256 newLimit);

    enum PasteErrorCode {
        INVALLID_PASTE_ID,
        INVALID_PASTE_TITLE,
        INVALID_IPFS_HASH,
        INVALID_SYNTAX,
        INVALID_CURRENT_TIME,
        NO_PASTE_FOUND,
        UNFINISHED_NEW_PASTE_COOLDOWN,
        USER_PASTE_LIMIT_EXCEEDED
    }

    error PasteCreateError(PasteErrorCode code, address sender);
    error PasteError(PasteErrorCode code, bytes32 id, address sender);

    struct Paste {
        bytes32 id;
        string title;
        string ipfsHash;
        string syntax;
        uint256 timestamp;
    }

    uint256 private newPasteCooldown = 60;
    uint256 private userPasteLimit = 100;

    mapping(address => Paste[]) private ownerToPastes;
    mapping(address => mapping(bytes32 => uint256)) private pasteIndex;

    constructor() Ownable(msg.sender) {}

    function _createPaste(
        bytes32 _id,
        string calldata _title,
        string calldata _ipfsHash,
        string calldata _syntax
    ) private {
        ownerToPastes[msg.sender].push(
            Paste({id: _id, title: _title, ipfsHash: _ipfsHash, syntax: _syntax, timestamp: block.timestamp})
        );
        pasteIndex[msg.sender][_id] = ownerToPastes[msg.sender].length;

        emit NewPaste(_id, msg.sender);
    }

    function _deletePaste(bytes32 _id) private {
        Paste[] storage pastes = ownerToPastes[msg.sender];
        uint256 index = pasteIndex[msg.sender][_id];
        uint256 arrayIndex = index - 1;
        uint256 lastIndex = pastes.length - 1;

        if (arrayIndex != lastIndex) {
            Paste storage lastPaste = pastes[lastIndex];
            pastes[arrayIndex] = lastPaste;
            pasteIndex[msg.sender][lastPaste.id] = index;
        }

        pastes.pop();
        delete pasteIndex[msg.sender][_id];

        emit PasteDeleted(_id, msg.sender);
    }

    function _updatePaste(
        bytes32 _id,
        string calldata _title,
        string calldata _ipfsHash,
        string calldata _syntax
    ) private {
        uint256 index = pasteIndex[msg.sender][_id];
        uint256 arrayIndex = index - 1;
        Paste storage paste = ownerToPastes[msg.sender][arrayIndex];

        paste.title = _title;
        paste.ipfsHash = _ipfsHash;
        paste.syntax = _syntax;

        emit PasteUpdated(_id, msg.sender);
    }

    function createPaste(
        string calldata _title,
        string calldata _ipfsHash,
        string calldata _syntax,
        uint256 _currentTimeSeconds
    ) external {
        Paste[] storage pastes = ownerToPastes[msg.sender];

        if (pastes.length > 0 && pastes[pastes.length - 1].timestamp + newPasteCooldown > block.timestamp) {
            revert PasteCreateError(PasteErrorCode.UNFINISHED_NEW_PASTE_COOLDOWN, msg.sender);
        }

        if (ownerToPastes[msg.sender].length >= userPasteLimit)
            revert PasteCreateError(PasteErrorCode.USER_PASTE_LIMIT_EXCEEDED, msg.sender);

        bytes memory titleBytes = bytes(_title);
        if (titleBytes.length < 4 || titleBytes.length > 100)
            revert PasteCreateError(PasteErrorCode.INVALID_PASTE_TITLE, msg.sender);

        if (bytes(_ipfsHash).length == 0) revert PasteCreateError(PasteErrorCode.INVALID_IPFS_HASH, msg.sender);

        if (bytes(_syntax).length == 0) revert PasteCreateError(PasteErrorCode.INVALID_SYNTAX, msg.sender);

        if (_currentTimeSeconds == 0) revert PasteCreateError(PasteErrorCode.INVALID_CURRENT_TIME, msg.sender);

        bytes32 id = keccak256(
            abi.encode(_title, _ipfsHash, _syntax, block.timestamp, msg.sender, _currentTimeSeconds)
        );

        _createPaste(id, _title, _ipfsHash, _syntax);
    }

    function deletePaste(bytes32 _id) external {
        if (_id == bytes32(0)) {
            revert PasteError(PasteErrorCode.INVALLID_PASTE_ID, _id, msg.sender);
        }

        if (pasteIndex[msg.sender][_id] == 0) {
            revert PasteError(PasteErrorCode.NO_PASTE_FOUND, _id, msg.sender);
        }

        _deletePaste(_id);
    }

    function updatePaste(
        bytes32 _id,
        string calldata _title,
        string calldata _ipfsHash,
        string calldata _syntax
    ) external {
        bytes memory titleBytes = bytes(_title);

        if (pasteIndex[msg.sender][_id] == 0) {
            revert PasteError(PasteErrorCode.NO_PASTE_FOUND, _id, msg.sender);
        }

        if (titleBytes.length < 4 || titleBytes.length > 100) {
            revert PasteError(PasteErrorCode.INVALID_PASTE_TITLE, _id, msg.sender);
        }

        if (bytes(_ipfsHash).length == 0) {
            revert PasteError(PasteErrorCode.INVALID_IPFS_HASH, _id, msg.sender);
        }

        if (bytes(_syntax).length == 0) {
            revert PasteError(PasteErrorCode.INVALID_SYNTAX, _id, msg.sender);
        }

        _updatePaste(_id, _title, _ipfsHash, _syntax);
    }

    function getPastes(uint256 _count, uint256 _skip) external view returns (Paste[] memory) {
        Paste[] storage pastes = ownerToPastes[msg.sender];
        uint256 totalPastes = pastes.length;

        if (_skip >= totalPastes) {
            return new Paste[](0);
        }

        uint256 availablePastes = totalPastes - _skip;
        uint256 resultLength = _count > availablePastes ? availablePastes : _count;
        Paste[] memory result = new Paste[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = pastes[_skip + i];
        }

        return result;
    }

    function getAllPaste() external view returns (Paste[] memory) {
        return ownerToPastes[msg.sender];
    }

    function getPaste(bytes32 _id) external view returns (Paste memory) {
        if (_id == bytes32(0)) {
            revert PasteError(PasteErrorCode.INVALLID_PASTE_ID, _id, msg.sender);
        }

        uint256 index = pasteIndex[msg.sender][_id];

        if (index == 0) {
            revert PasteError(PasteErrorCode.NO_PASTE_FOUND, _id, msg.sender);
        }

        return ownerToPastes[msg.sender][index - 1];
    }

    function setUserPasteLimit(uint256 _newLimit) external onlyOwner {
        uint256 oldLimit = userPasteLimit;
        userPasteLimit = _newLimit;

        emit UserPasteLimitUpdated(oldLimit, _newLimit);
    }

    function setNewPasteCooldown(uint256 _newTime) external onlyOwner {
        uint256 oldTime = newPasteCooldown;
        newPasteCooldown = _newTime;

        emit NewPasteCooldownUpdated(oldTime, _newTime);
    }
}
