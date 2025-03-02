const { ethers } = require("ethers");
require("dotenv").config(); // Load environment variables

async function main() {
    const contractAddress = "0xDfF94A7b021caE6cD52fb92A827267754Eedb483"; // Replace with actual deployed contract address
    const contractABI = require("../artifacts/contracts/IdentityVerification.sol/IdentityVerification.json").abi;

    if (!process.env.PRIVATE_KEY) {
        console.error("❌ PRIVATE_KEY is missing from .env file");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    console.log("🔹 Adding a new record...");

    try {
        const tx = await contract.addRecord("12345abcd"); 
        await tx.wait();
        console.log("✅ Record added successfully!");
    } catch (error) {
        console.error("❌ Error adding record:", error);
    }
}

main().catch((error) => {
    console.error("❌ Script execution error:", error);
    process.exit(1);
});
