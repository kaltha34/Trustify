// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityVerification {
    address public admin;

    enum RecordStatus { Pending, Approved, Revoked }

    struct IdentityRecord {
        string documentHash;
        RecordStatus status;
        address addedBy;
    }

    mapping(string => IdentityRecord) private records;
    mapping(address => bool) public verifiers;
    mapping(address => bool) public users;

    event RecordAdded(string documentHash, address addedBy);
    event RecordApproved(string documentHash, address approvedBy);
    event RecordRevoked(string documentHash, address revokedBy);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifiers can perform this action.");
        _;
    }

    modifier onlyUser() {
        require(users[msg.sender], "Only registered users can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
        verifiers[msg.sender] = true; // Admin is the default verifier
    }

    function addUser(address user) external onlyAdmin {
        users[user] = true;
    }

    function addVerifier(address verifier) external onlyAdmin {
        verifiers[verifier] = true;
    }

    function removeVerifier(address verifier) external onlyAdmin {
        verifiers[verifier] = false;
    }

    function addRecord(string memory documentHash) external onlyUser {
        require(bytes(records[documentHash].documentHash).length == 0, "Record already exists.");
        records[documentHash] = IdentityRecord(documentHash, RecordStatus.Pending, msg.sender);
        emit RecordAdded(documentHash, msg.sender);
    }

    function approveRecord(string memory documentHash) external onlyVerifier {
        require(bytes(records[documentHash].documentHash).length != 0, "Record does not exist.");
        require(records[documentHash].status == RecordStatus.Pending, "Record not pending.");
        records[documentHash].status = RecordStatus.Approved;
        emit RecordApproved(documentHash, msg.sender);
    }

    function revokeRecord(string memory documentHash) external onlyVerifier {
        require(bytes(records[documentHash].documentHash).length != 0, "Record does not exist.");
        require(records[documentHash].status == RecordStatus.Approved, "Record must be approved first.");
        records[documentHash].status = RecordStatus.Revoked;
        emit RecordRevoked(documentHash, msg.sender);
    }

    function getRecord(string memory documentHash) external view returns (string memory, RecordStatus, address) {
        require(bytes(records[documentHash].documentHash).length != 0, "Record does not exist.");
        IdentityRecord memory record = records[documentHash];
        return (record.documentHash, record.status, record.addedBy);
    }
}
