// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IdentityDocuments {
    // State variables
    address public admin;
    mapping(address => bool) public verifiers;

    // Document types
    enum DocumentType { NIC, BIRTH_CERTIFICATE, PASSPORT }

    // Document structure
    struct Document {
        DocumentType docType;
        string ipfsHash;
        uint256 timestamp;
        bool isValid;
        bool isVerified;
        address verifiedBy;
    }

    // Mapping from user address to their documents
    mapping(address => mapping(DocumentType => Document)) public userDocuments;
    
    // Events
    event DocumentUploaded(address indexed user, DocumentType docType, string ipfsHash);
    event DocumentVerified(address indexed user, DocumentType docType, address verifier);
    event DocumentRevoked(address indexed user, DocumentType docType);
    event VerifierAdded(address verifier);
    event VerifierRemoved(address verifier);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifiers can perform this action");
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
        verifiers[msg.sender] = true; // Admin is also a verifier
    }

    // Admin functions
    function addVerifier(address _verifier) external onlyAdmin {
        require(_verifier != address(0), "Invalid verifier address");
        require(!verifiers[_verifier], "Already a verifier");
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }

    function removeVerifier(address _verifier) external onlyAdmin {
        require(_verifier != admin, "Cannot remove admin as verifier");
        require(verifiers[_verifier], "Not a verifier");
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }

    // Document management functions
    function uploadDocument(DocumentType _docType, string memory _ipfsHash) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(!userDocuments[msg.sender][_docType].isValid, "Document already exists");

        Document memory doc = Document({
            docType: _docType,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            isValid: true,
            isVerified: false,
            verifiedBy: address(0)
        });
        
        userDocuments[msg.sender][_docType] = doc;
        emit DocumentUploaded(msg.sender, _docType, _ipfsHash);
    }

    function verifyDocument(address _user, DocumentType _docType) external onlyVerifier {
        require(userDocuments[_user][_docType].isValid, "Document not found or invalid");
        require(!userDocuments[_user][_docType].isVerified, "Document already verified");

        Document storage doc = userDocuments[_user][_docType];
        doc.isVerified = true;
        doc.verifiedBy = msg.sender;

        emit DocumentVerified(_user, _docType, msg.sender);
    }

    function revokeDocument(DocumentType _docType) public {
        Document storage doc = userDocuments[msg.sender][_docType];
        require(doc.isValid, "Document not found or already revoked");
        
        // Only the document owner or a verifier can revoke
        require(
            msg.sender == admin || 
            verifiers[msg.sender] || 
            msg.sender == address(this), 
            "Not authorized to revoke"
        );

        doc.isValid = false;
        emit DocumentRevoked(msg.sender, _docType);
    }

    // View functions
    function getDocument(address _user, DocumentType _docType) public view returns (
        string memory ipfsHash,
        uint256 timestamp,
        bool isValid,
        bool isVerified,
        address verifiedBy
    ) {
        Document memory doc = userDocuments[_user][_docType];
        return (
            doc.ipfsHash,
            doc.timestamp,
            doc.isValid,
            doc.isVerified,
            doc.verifiedBy
        );
    }

    function hasValidDocument(address _user, DocumentType _docType) public view returns (bool) {
        Document memory doc = userDocuments[_user][_docType];
        return doc.isValid && doc.isVerified;
    }

    function isVerifier(address _address) public view returns (bool) {
        return verifiers[_address];
    }
}
