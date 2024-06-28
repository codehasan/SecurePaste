// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecurePaste {
    event NewPaste(bytes24 indexed hash, address indexed owner);
    event PasteDeleted(bytes24 indexed hash, address indexed owner);
    event PasteUpdated(
        bytes24 indexed prevHash,
        bytes24 indexed newHash,
        address indexed owner
    );

    enum PasteErrorCode {
        USER_PASTE_LIMIT_REACHED,
        TOTAL_PASTE_LIMIT_REACHED,
        NO_HASH_FOUND,
        NOT_OWNER,
        HASH_ALREADY_EXISTS
    }

    error PasteError(PasteErrorCode code, bytes24 hash, address sender);

    // These limits are imposed based on Pinata free tier limits
    uint8 private constant USER_PASTE_LIMIT = 10;
    uint16 private constant TOTAL_PASTE_LIMIT = 500;
    uint16 private totalPasteCount;

    mapping(bytes24 => address) private pasteToOwner;
    mapping(address => bytes24[10]) private ownerToPastes;
    mapping(address => uint8) private ownerPasteCount;

    modifier onlyPasteOwner(bytes24 _hash) {
        if (pasteToOwner[_hash] != msg.sender)
            revert PasteError(PasteErrorCode.NOT_OWNER, _hash, msg.sender);
        _;
    }

    function _createPaste(bytes24 _hash) private {
        uint8 totalOwnerPastes = ownerPasteCount[msg.sender];
        ownerToPastes[msg.sender][totalOwnerPastes] = _hash;
        pasteToOwner[_hash] = msg.sender;
        ownerPasteCount[msg.sender]++;
        totalPasteCount++;

        emit NewPaste(_hash, msg.sender);
    }

    function _deletePaste(bytes24 _hash) private {
        bytes24[10] storage ownerPastes = ownerToPastes[msg.sender];
        uint8 totalOwnerPastes = ownerPasteCount[msg.sender];

        for (uint8 i = 0; i < totalOwnerPastes; i++) {
            if (ownerPastes[i] == _hash) {
                if (totalOwnerPastes > 1)
                    ownerPastes[i] = ownerPastes[totalOwnerPastes - 1];
                pasteToOwner[_hash] = address(0);
                ownerPasteCount[msg.sender]--;
                totalPasteCount--;

                emit PasteDeleted(_hash, msg.sender);
                return;
            }
        }
        revert PasteError(PasteErrorCode.NO_HASH_FOUND, _hash, msg.sender);
    }

    function _updatePaste(bytes24 _prevHash, bytes24 _newHash) private {
        bytes24[10] storage ownerPastes = ownerToPastes[msg.sender];
        uint8 totalOwnerPastes = ownerPasteCount[msg.sender];

        for (uint8 i = 0; i < totalOwnerPastes; i++) {
            if (ownerPastes[i] == _prevHash) {
                ownerPastes[i] = _newHash;
                pasteToOwner[_prevHash] = address(0);
                pasteToOwner[_newHash] = msg.sender;

                emit PasteUpdated(_prevHash, _newHash, msg.sender);
                return;
            }
        }
        revert PasteError(PasteErrorCode.NO_HASH_FOUND, _prevHash, msg.sender);
    }

    function createPaste(bytes24 _hash) external {
        if (ownerPasteCount[msg.sender] == USER_PASTE_LIMIT)
            revert PasteError(
                PasteErrorCode.USER_PASTE_LIMIT_REACHED,
                _hash,
                msg.sender
            );
        if (totalPasteCount == TOTAL_PASTE_LIMIT)
            revert PasteError(
                PasteErrorCode.TOTAL_PASTE_LIMIT_REACHED,
                _hash,
                msg.sender
            );
        _createPaste(_hash);
    }

    function deletePaste(bytes24 _hash) external onlyPasteOwner(_hash) {
        if (ownerPasteCount[msg.sender] == 0)
            revert PasteError(PasteErrorCode.NO_HASH_FOUND, _hash, msg.sender);
        _deletePaste(_hash);
    }

    function updatePaste(
        bytes24 _prevHash,
        bytes24 _newHash
    ) external onlyPasteOwner(_prevHash) {
        if (ownerPasteCount[msg.sender] == 0)
            revert PasteError(
                PasteErrorCode.NO_HASH_FOUND,
                _prevHash,
                msg.sender
            );
        if (pasteToOwner[_newHash] != address(0))
            revert PasteError(
                PasteErrorCode.HASH_ALREADY_EXISTS,
                _newHash,
                msg.sender
            );
        _updatePaste(_prevHash, _newHash);
    }

    function getPastesByOwner(
        address _owner
    ) external view returns (bytes24[] memory) {
        uint8 totalOwnerPastes = ownerPasteCount[_owner];
        bytes24[] memory result = new bytes24[](totalOwnerPastes);
        bytes24[10] storage ownerPastes = ownerToPastes[msg.sender];

        for (uint8 i = 0; i < totalOwnerPastes; i++) {
            result[i] = ownerPastes[i];
        }
        return result;
    }
}
