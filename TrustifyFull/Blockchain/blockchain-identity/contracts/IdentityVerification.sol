// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IdentityVerification {
    address public admin;

    enum RecordStatus { PENDING, APPROVED, REVOKED }
    enum VerificationTier { NONE, BASIC, TRUSTED, CERTIFIED }

    struct IdentityRecord {
        string documentCID;
        RecordStatus status;
        address addedBy;
        uint256 timestamp;
        uint256 expiryTimestamp;
        VerificationTier tier;
        uint256 verificationCount;
        mapping(address => bool) verifierSignatures;
    }

    struct VerificationRequest {
        address user;
        string documentCID;
        uint256 requestTimestamp;
        uint256 expiryTimestamp;
        bool isActive;
    }

    // State variables
    mapping(string => IdentityRecord) private records;
    mapping(address => bool) public verifiers;
    mapping(address => bool) public users;
    mapping(VerificationTier => uint256) public requiredSignatures;
    mapping(string => VerificationRequest) public verificationRequests;
    mapping(address => string[]) public userRecords;

    uint256 public constant VERIFICATION_TIMEOUT = 7 days;
    uint256 public constant MAX_VERIFICATION_ATTEMPTS = 3;

    // Events
    event UserRegistered(address indexed user);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event RecordAdded(string documentCID, address indexed addedBy);
    event RecordApproved(string documentCID, address indexed approvedBy, VerificationTier tier);
    event RecordRevoked(string documentCID, address indexed revokedBy);
    event VerificationRequested(string documentCID, address indexed requestedBy);
    event VerificationTimedOut(string documentCID);
    event VerificationSignatureAdded(string documentCID, address indexed verifier);
    event TierUpgraded(string documentCID, VerificationTier newTier);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifiers can perform this action");
        _;
    }

    modifier onlyUser() {
        require(users[msg.sender], "Only registered users can perform this action");
        _;
    }

    modifier recordExists(string memory documentCID) {
        require(bytes(records[documentCID].documentCID).length != 0, "Record does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        verifiers[msg.sender] = true;

        // Initialize required signatures for each tier
        requiredSignatures[VerificationTier.BASIC] = 1;
        requiredSignatures[VerificationTier.TRUSTED] = 2;
        requiredSignatures[VerificationTier.CERTIFIED] = 3;
    }

    // User management
    function addUser(address user) external onlyAdmin {
        require(!users[user], "User already registered");
        users[user] = true;
        emit UserRegistered(user);
    }

    function addVerifier(address verifier) external onlyAdmin {
        require(!verifiers[verifier], "Already a verifier");
        verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyAdmin {
        require(verifier != admin, "Cannot remove admin verifier");
        require(verifiers[verifier], "Not a verifier");
        verifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    // Record management
    function addRecord(string memory documentCID) external onlyUser {
        require(bytes(documentCID).length != 0, "Invalid CID");
        require(bytes(records[documentCID].documentCID).length == 0, "Record already exists");

        IdentityRecord storage newRecord = records[documentCID];
        newRecord.documentCID = documentCID;
        newRecord.status = RecordStatus.PENDING;
        newRecord.addedBy = msg.sender;
        newRecord.timestamp = block.timestamp;
        newRecord.tier = VerificationTier.NONE;
        newRecord.verificationCount = 0;

        userRecords[msg.sender].push(documentCID);
        emit RecordAdded(documentCID, msg.sender);
    }

    function requestVerification(string memory documentCID) external onlyUser recordExists(documentCID) {
        require(records[documentCID].addedBy == msg.sender, "Not the record owner");
        require(records[documentCID].status != RecordStatus.REVOKED, "Record is revoked");
        require(!verificationRequests[documentCID].isActive, "Verification already requested");

        verificationRequests[documentCID] = VerificationRequest({
            user: msg.sender,
            documentCID: documentCID,
            requestTimestamp: block.timestamp,
            expiryTimestamp: block.timestamp + VERIFICATION_TIMEOUT,
            isActive: true
        });

        emit VerificationRequested(documentCID, msg.sender);
    }

    function addVerificationSignature(string memory documentCID) external onlyVerifier recordExists(documentCID) {
        VerificationRequest storage request = verificationRequests[documentCID];
        require(request.isActive, "No active verification request");
        require(block.timestamp <= request.expiryTimestamp, "Verification request expired");
        
        IdentityRecord storage record = records[documentCID];
        require(!record.verifierSignatures[msg.sender], "Already signed by this verifier");

        record.verifierSignatures[msg.sender] = true;
        record.verificationCount++;

        // Update verification tier based on signature count
        if (record.verificationCount >= requiredSignatures[VerificationTier.CERTIFIED]) {
            record.tier = VerificationTier.CERTIFIED;
        } else if (record.verificationCount >= requiredSignatures[VerificationTier.TRUSTED]) {
            record.tier = VerificationTier.TRUSTED;
        } else if (record.verificationCount >= requiredSignatures[VerificationTier.BASIC]) {
            record.tier = VerificationTier.BASIC;
        }

        if (record.status == RecordStatus.PENDING) {
            record.status = RecordStatus.APPROVED;
            emit RecordApproved(documentCID, msg.sender, record.tier);
        }

        emit VerificationSignatureAdded(documentCID, msg.sender);
        
        if (record.tier != VerificationTier.NONE) {
            emit TierUpgraded(documentCID, record.tier);
        }
    }

    function checkVerificationTimeout(string memory documentCID) external recordExists(documentCID) {
        VerificationRequest storage request = verificationRequests[documentCID];
        require(request.isActive, "No active verification request");
        require(block.timestamp > request.expiryTimestamp, "Verification timeout not reached");

        request.isActive = false;
        emit VerificationTimedOut(documentCID);
    }

    // View functions
    function getRecord(string memory documentCID) external view recordExists(documentCID) returns (
        string memory _documentCID,
        RecordStatus status,
        address addedBy,
        uint256 timestamp,
        uint256 expiryTimestamp,
        VerificationTier tier,
        uint256 verificationCount
    ) {
        IdentityRecord storage record = records[documentCID];
        return (
            record.documentCID,
            record.status,
            record.addedBy,
            record.timestamp,
            record.expiryTimestamp,
            record.tier,
            record.verificationCount
        );
    }

    function getUserRecords(address user) external view returns (string[] memory) {
        return userRecords[user];
    }

    function getVerificationSignatureCount(string memory documentCID) external view recordExists(documentCID) returns (uint256) {
        return records[documentCID].verificationCount;
    }
}
