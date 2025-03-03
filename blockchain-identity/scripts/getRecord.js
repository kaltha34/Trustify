const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const contractAddress = "0xDfF94A7b021caE6cD52fb92A827267754Eedb483"; // Replace with your contract address
    const contractABI = require("../artifacts/contracts/IdentityVerification.sol/IdentityVerification.json").abi;

    const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const documentHash = "abcs456"; 

    console.log("🔹 Fetching record...");

    try {
        const record = await contract.getRecord(documentHash);
        console.log(`✅ Record Found:`);
        console.log(`   🔹 Document Hash: ${record[0]}`);
        console.log(`   🔹 Status: ${["Pending", "Approved", "Revoked"][record[1]]}`);
        console.log(`   🔹 Added By: ${record[2]}`);
    } catch (error) {
        console.error("❌ Error fetching record:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
