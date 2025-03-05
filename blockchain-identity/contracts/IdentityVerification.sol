// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityVerification {
    address public admin;

    enum RecordStatus { Pending, Approved, Revoked }

    struct IdentityRecord {
        string documentCID; // Store Web3 Storage CID instead of a document hash
        RecordStatus status;
        address addedBy;
    }

    mapping(string => IdentityRecord) private records;
    mapping(address => bool) public verifiers;
    mapping(address => bool) public users;

    event RecordAdded(string documentCID, address addedBy);
    event RecordApproved(string documentCID, address approvedBy);
    event RecordRevoked(string documentCID, address revokedBy);

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

    function addRecord(string memory documentCID) external onlyUser {
        require(bytes(records[documentCID].documentCID).length == 0, "Record already exists.");
        records[documentCID] = IdentityRecord(documentCID, RecordStatus.Pending, msg.sender);
        emit RecordAdded(documentCID, msg.sender);
    }

    function approveRecord(string memory documentCID) external onlyVerifier {
        require(bytes(records[documentCID].documentCID).length != 0, "Record does not exist.");
        require(records[documentCID].status == RecordStatus.Pending, "Record not pending.");
        records[documentCID].status = RecordStatus.Approved;
        emit RecordApproved(documentCID, msg.sender);
    }

    function revokeRecord(string memory documentCID) external onlyVerifier {
        require(bytes(records[documentCID].documentCID).length != 0, "Record does not exist.");
        require(records[documentCID].status == RecordStatus.Approved, "Record must be approved first.");
        records[documentCID].status = RecordStatus.Revoked;
        emit RecordRevoked(documentCID, msg.sender);
    }

    function getRecord(string memory documentCID) external view returns (string memory, RecordStatus, address) {
        require(bytes(records[documentCID].documentCID).length != 0, "Record does not exist.");
        IdentityRecord memory record = records[documentCID];
        return (record.documentCID, record.status, record.addedBy);
    }
}
