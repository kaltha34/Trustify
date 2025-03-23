// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IdentityDocuments {
    // State variables
    mapping(address => bool) public verifiers;
    mapping(address => mapping(uint8 => Document)) private documents;
    address public owner;

    // Document types
    enum DocumentType { NIC, BIRTH_CERTIFICATE, PASSPORT }

    // Document structure
    struct Document {
        string ipfsHash;
        uint256 timestamp;
        bool isValid;
        bool isVerified;
        address verifiedBy;
    }

    // Events
    event DocumentUploaded(address indexed user, uint8 docType, string ipfsHash);
    event DocumentVerified(address indexed user, uint8 docType, address verifier);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifiers can perform this action");
        _;
    }

    modifier validDocType(uint8 docType) {
        require(docType <= uint8(DocumentType.PASSPORT), "Invalid document type");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        verifiers[msg.sender] = true; // Owner is the default verifier
    }

    // Document management functions
    function uploadDocument(uint8 docType, string memory ipfsHash) external validDocType(docType) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(documents[msg.sender][docType].ipfsHash).length == 0, "Document already exists");

        documents[msg.sender][docType] = Document({
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            isValid: true,
            isVerified: false,
            verifiedBy: address(0)
        });

        emit DocumentUploaded(msg.sender, docType, ipfsHash);
    }

    function getDocument(address user, uint8 docType) external view validDocType(docType) returns (Document memory) {
        require(bytes(documents[user][docType].ipfsHash).length > 0, "Document does not exist");
        return documents[user][docType];
    }

    function verifyDocument(address user, uint8 docType) external onlyVerifier validDocType(docType) {
        require(bytes(documents[user][docType].ipfsHash).length > 0, "Document does not exist");
        require(!documents[user][docType].isVerified, "Document already verified");

        documents[user][docType].isVerified = true;
        documents[user][docType].verifiedBy = msg.sender;

        emit DocumentVerified(user, docType, msg.sender);
    }

    // Verifier management functions
    function addVerifier(address _verifier) external onlyOwner {
        require(!verifiers[_verifier], "Verifier already exists");
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }

    function removeVerifier(address _verifier) external onlyOwner {
        require(verifiers[_verifier], "Not a verifier");
        require(_verifier != owner, "Cannot remove owner as verifier");
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }

    function isVerifier(address _verifier) external view returns (bool) {
        return verifiers[_verifier];
    }
}
