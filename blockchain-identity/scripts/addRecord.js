const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const contractAddress = "0xb9528Ba389CD58762E01B8e3feA73a2d1d3a0a9C"; 
    const contractABI = require("../artifacts/contracts/IdentityVerification.sol/IdentityVerification.json").abi;

    // 🚀 Connect to the SKALE testnet
    const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");

    // 🚀 Load wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 🚀 Connect contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // 🔹 Define a document hash
    const documentHash = "kalari"; 

    console.log("🔹 Adding record...");

    try {
        // Call addRecord function
        const tx = await contract.addRecord(documentHash);
        await tx.wait();

        console.log(`✅ Record added successfully! Document Hash: ${documentHash}`);
    } catch (error) {
        if (error?.info?.error?.message.includes("Record already exists")) {
            console.error("❌ Error: Record already exists.");
        } else if (error?.info?.error?.message.includes("Only registered users can perform this action")) {
            console.error("❌ Error: You must be a registered user to add a record. Ask the admin to add you.");
        } else {
            console.error("❌ Error adding record:", error);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
