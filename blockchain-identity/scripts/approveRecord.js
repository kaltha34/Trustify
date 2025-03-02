const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const contractAddress = "0xDfF94A7b021caE6cD52fb92A827267754Eedb483"; // Replace with actual deployed contract address
    const contractABI = require("../artifacts/contracts/IdentityVerification.sol/IdentityVerification.json").abi;

    // 🚀 Use SKALE RPC URL
    const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");

    // 🚀 Use wallet private key directly, avoiding ENS issues
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 🚀 Connect wallet to contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const documentHash = "12345abcd"; // Replace with your document hash

    console.log("🔹 Approving record...");

    try {
        // Call the approveRecord function
        const tx = await contract.approveRecord(documentHash);
        await tx.wait();
        console.log("✅ Record approved successfully!");
    } catch (error) {
        console.error("❌ Error approving record:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
