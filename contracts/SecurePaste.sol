// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecurePaste {
    event NewPaste(bytes32 indexed id, address indexed owner);
    event PasteDeleted(bytes32 indexed id, address indexed owner);
    event PasteUpdated(bytes32 indexed id, address indexed owner);

    enum PasteErrorCode {
        INVALLID_PASTE_ID,
        INVALID_PASTE_TITLE,
        INVALID_IPFS_HASH,
        INVALID_SYNTAX,
        INVALID_CURRENT_TIME,
        NO_PASTE_FOUND
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

    mapping(address => Paste[]) private ownerToPastes;

    function _createPaste(
        bytes32 _id,
        string calldata _title,
        string calldata _ipfsHash,
        string calldata _syntax
    ) private {
        ownerToPastes[msg.sender].push(
            Paste({
                id: _id,
                title: _title,
                ipfsHash: _ipfsHash,
                syntax: _syntax,
                timestamp: block.timestamp
            })
        );

        emit NewPaste(_id, msg.sender);
    }

    function _deletePaste(bytes32 _id) private {
        Paste[] storage ownerPastes = ownerToPastes[msg.sender];
        uint256 len = ownerPastes.length;

        for (uint8 i = 0; i < len; i++) {
            if (ownerPastes[i].id == _id) {
                if (i != len - 1) {
                    ownerPastes[i] = ownerPastes[len - 1];
                }
                ownerPastes.pop();

                emit PasteDeleted(_id, msg.sender);
                return;
            }
        }
        revert PasteError(PasteErrorCode.NO_PASTE_FOUND, _id, msg.sender);
    }

    function _updatePaste(
        bytes32 _id,
        string calldata _title,
        string calldata _ipfsHash,
        string calldata _syntax
    ) private {
        Paste[] storage pastes = ownerToPastes[msg.sender];

        for (uint8 i = 0; i < pastes.length; i++) {
            if (pastes[i].id == _id) {
                Paste storage paste = pastes[i];

                paste.title = _title;
                paste.ipfsHash = _ipfsHash;
                paste.syntax = _syntax;

                emit PasteUpdated(_id, msg.sender);
                return;
            }
        }
        revert PasteError(PasteErrorCode.NO_PASTE_FOUND, _id, msg.sender);
    }

    function createPaste(
        string calldata _title,
        string calldata _ipfsHash,
        string calldata _syntax,
        uint256 _currentTimeMillis
    ) external {
        bytes memory titleBytes = bytes(_title);

        if (titleBytes.length < 4 || titleBytes.length > 100) {
            revert PasteCreateError(PasteErrorCode.INVALID_PASTE_TITLE, msg.sender);
        }
        if (bytes(_ipfsHash).length == 0) {
            revert PasteCreateError(PasteErrorCode.INVALID_IPFS_HASH, msg.sender);
        }
        if (bytes(_syntax).length == 0) {
            revert PasteCreateError(PasteErrorCode.INVALID_SYNTAX, msg.sender);
        }
        if (_currentTimeMillis == 0) {
            revert PasteCreateError(PasteErrorCode.INVALID_CURRENT_TIME, msg.sender);
        }

        bytes32 id = keccak256(
            abi.encodePacked(
                _title,
                _ipfsHash,
                _syntax,
                block.timestamp,
                msg.sender,
                _currentTimeMillis
            )
        );

        _createPaste(id, _title, _ipfsHash, _syntax);
    }

    function deletePaste(bytes32 _id) external {
        if (_id == bytes32(0)) {
            revert PasteError(PasteErrorCode.INVALLID_PASTE_ID, _id, msg.sender);
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

        if (_id == bytes32(0)) {
            revert PasteError(PasteErrorCode.INVALLID_PASTE_ID, _id, msg.sender);
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

    function getPastes() external view returns (Paste[] memory) {
        return ownerToPastes[msg.sender];
    }

    function getPaste(bytes32 _id) external view returns (Paste memory) {
        Paste[] storage ownerPastes = ownerToPastes[msg.sender];

        for (uint8 i = 0; i < ownerPastes.length; i++) {
            if (ownerPastes[i].id == _id) {
                return ownerPastes[i];
            }
        }
        revert PasteError(PasteErrorCode.NO_PASTE_FOUND, _id, msg.sender);
    }
}
