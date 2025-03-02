const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const contractAddress = "0xDfF94A7b021caE6cD52fb92A827267754Eedb483"; // Your deployed contract address
    const contractABI = require("../artifacts/contracts/IdentityVerification.sol/IdentityVerification.json").abi;

    const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    console.log("🔹 Registering user...");

    const tx = await contract.addUser(wallet.address);
    await tx.wait();

    console.log(`✅ Wallet ${wallet.address} registered successfully!`);
}

main().catch((error) => {
    console.error("❌ Error registering user:", error);
    process.exit(1);
});
