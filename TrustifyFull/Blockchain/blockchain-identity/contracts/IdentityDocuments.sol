// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IdentityDocuments {
    // State variables
    address public admin;
    mapping(address => bool) public verifiers;

    // Document types
    enum DocumentType { NIC, BIRTH_CERTIFICATE, PASSPORT, DRIVING_LICENSE, EDUCATIONAL_CERTIFICATE }
    enum VerificationLevel { NONE, BASIC, ADVANCED, PREMIUM }

    // Document structure with enhanced metadata
    struct Document {
        DocumentType docType;
        string ipfsHash;
        uint256 timestamp;
        uint256 expiryDate;
        bool isValid;
        bool isVerified;
        address verifiedBy;
        VerificationLevel verificationLevel;
        string metadata; // JSON string containing additional metadata
        uint256 version;
        uint256 verificationCount;
        mapping(address => bool) verifierSignatures;
    }

    // Version history structure
    struct VersionHistory {
        string ipfsHash;
        uint256 timestamp;
        string changeDescription;
    }

    // Mapping from user address to their documents
    mapping(address => mapping(DocumentType => Document)) public userDocuments;
    // Mapping for document version history
    mapping(address => mapping(DocumentType => VersionHistory[])) public documentHistory;
    // Required signatures for verification levels
    mapping(VerificationLevel => uint256) public requiredSignatures;
    
    // Events
    event DocumentUploaded(address indexed user, DocumentType docType, string ipfsHash, uint256 version);
    event DocumentVerified(address indexed user, DocumentType docType, address verifier, VerificationLevel level);
    event DocumentRevoked(address indexed user, DocumentType docType);
    event DocumentUpdated(address indexed user, DocumentType docType, uint256 version);
    event VerifierAdded(address verifier);
    event VerifierRemoved(address verifier);
    event DocumentExpired(address indexed user, DocumentType docType);
    event VerificationSignatureAdded(address indexed user, DocumentType docType, address verifier);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifiers can perform this action");
        _;
    }

    modifier documentExists(address user, DocumentType docType) {
        require(userDocuments[user][docType].isValid, "Document does not exist or is invalid");
        _;
    }

    modifier notExpired(address user, DocumentType docType) {
        require(
            userDocuments[user][docType].expiryDate == 0 || 
            userDocuments[user][docType].expiryDate > block.timestamp, 
            "Document has expired"
        );
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
        verifiers[msg.sender] = true; // Admin is also a verifier
        
        // Set required signatures for each verification level
        requiredSignatures[VerificationLevel.BASIC] = 1;
        requiredSignatures[VerificationLevel.ADVANCED] = 2;
        requiredSignatures[VerificationLevel.PREMIUM] = 3;
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
    function uploadDocument(
        DocumentType _docType,
        string memory _ipfsHash,
        uint256 _expiryDate,
        string memory _metadata
    ) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        Document storage doc = userDocuments[msg.sender][_docType];
        uint256 newVersion = doc.isValid ? doc.version + 1 : 1;

        // Store old version in history if it exists
        if (doc.isValid) {
            documentHistory[msg.sender][_docType].push(VersionHistory({
                ipfsHash: doc.ipfsHash,
                timestamp: doc.timestamp,
                changeDescription: "Updated document"
            }));
        }

        // Update document
        doc.docType = _docType;
        doc.ipfsHash = _ipfsHash;
        doc.timestamp = block.timestamp;
        doc.expiryDate = _expiryDate;
        doc.isValid = true;
        doc.isVerified = false;
        doc.verifiedBy = address(0);
        doc.verificationLevel = VerificationLevel.NONE;
        doc.metadata = _metadata;
        doc.version = newVersion;
        doc.verificationCount = 0;

        emit DocumentUploaded(msg.sender, _docType, _ipfsHash, newVersion);
    }

    function signDocument(address _user, DocumentType _docType) 
        public 
        onlyVerifier 
        documentExists(_user, _docType)
        notExpired(_user, _docType)
    {
        Document storage doc = userDocuments[_user][_docType];
        require(!doc.verifierSignatures[msg.sender], "Already signed by this verifier");

        doc.verifierSignatures[msg.sender] = true;
        doc.verificationCount++;

        // Update verification level based on signature count
        if (doc.verificationCount >= requiredSignatures[VerificationLevel.PREMIUM]) {
            doc.verificationLevel = VerificationLevel.PREMIUM;
        } else if (doc.verificationCount >= requiredSignatures[VerificationLevel.ADVANCED]) {
            doc.verificationLevel = VerificationLevel.ADVANCED;
        } else if (doc.verificationCount >= requiredSignatures[VerificationLevel.BASIC]) {
            doc.verificationLevel = VerificationLevel.BASIC;
        }

        if (!doc.isVerified) {
            doc.isVerified = true;
            doc.verifiedBy = msg.sender;
        }

        emit VerificationSignatureAdded(_user, _docType, msg.sender);
        emit DocumentVerified(_user, _docType, msg.sender, doc.verificationLevel);
    }

    function revokeDocument(address _user, DocumentType _docType) 
        public 
        documentExists(_user, _docType)
    {
        require(msg.sender == admin || msg.sender == _user, "Only admin or document owner can revoke");
        
        Document storage doc = userDocuments[_user][_docType];
        doc.isValid = false;
        doc.isVerified = false;
        
        emit DocumentRevoked(_user, _docType);
    }

    // View functions
    function getDocument(address _user, DocumentType _docType) 
        public 
        view 
        returns (
            string memory ipfsHash,
            uint256 timestamp,
            uint256 expiryDate,
            bool isValid,
            bool isVerified,
            address verifiedBy,
            VerificationLevel verificationLevel,
            string memory metadata,
            uint256 version
        )
    {
        Document storage doc = userDocuments[_user][_docType];
        return (
            doc.ipfsHash,
            doc.timestamp,
            doc.expiryDate,
            doc.isValid,
            doc.isVerified,
            doc.verifiedBy,
            doc.verificationLevel,
            doc.metadata,
            doc.version
        );
    }

    function getDocumentHistory(address _user, DocumentType _docType) 
        public 
        view 
        returns (VersionHistory[] memory)
    {
        return documentHistory[_user][_docType];
    }

    function getVerifierCount() public view returns (uint256 count) {
        count = 0;
        for (uint256 i = 0; i < type(uint256).max; i++) {
            address verifier = address(uint160(i));
            if (verifiers[verifier]) {
                count++;
            }
        }
    }

    function checkVerificationSignature(
        address _user,
        DocumentType _docType,
        address _verifier
    ) public view returns (bool) {
        return userDocuments[_user][_docType].verifierSignatures[_verifier];
    }
}
