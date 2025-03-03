const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const contractAddress = "0xfddCA012444F0A0F25E83fe5Dc33f5Dc58a26f6a"; 
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
