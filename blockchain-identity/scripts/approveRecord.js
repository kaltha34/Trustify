const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const contractAddress = "0xfddCA012444F0A0F25E83fe5Dc33f5Dc58a26f6a"; 
    const contractABI = require("../artifacts/contracts/IdentityVerification.sol/IdentityVerification.json").abi;

    // 🚀 Use SKALE RPC URL
    const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");

    // 🚀 Use wallet private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 🚀 Connect wallet to contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const documentHash = "abcs456"; 
    console.log("🔹 Checking if record exists...");

    try {
        // Call getRecord to check if the record exists
        const record = await contract.getRecord(documentHash);

        const status = record[1]; // Second element in the returned tuple is RecordStatus

        if (status === 1) { // 1 represents "Approved"
            console.log("✅ Record is already approved.");
            return;
        }

        console.log("🔹 Approving record...");

        // Call the approveRecord function
        const tx = await contract.approveRecord(documentHash);
        await tx.wait();

        console.log("✅ Record approved successfully!");
    } catch (error) {
        if (error?.info?.error?.message.includes("Record does not exist")) {
            console.error("❌ Error: The record does not exist. Please add the record before approving.");
        } else {
            console.error("❌ Error approving record:", error);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
