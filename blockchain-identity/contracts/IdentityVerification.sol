// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IdentityVerification {
    // State variables
    mapping(address => bool) public verifiers;
    mapping(address => bool) public users;
    address public owner;

    // Events
    event UserAdded(address indexed user);
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

    // Constructor
    constructor() {
        owner = msg.sender;
        verifiers[msg.sender] = true; // Owner is the default verifier
    }

    // User management functions
    function addUser(address _user) external onlyVerifier {
        require(!users[_user], "User already exists");
        users[_user] = true;
        emit UserAdded(_user);
    }

    function isUser(address _user) external view returns (bool) {
        return users[_user];
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
