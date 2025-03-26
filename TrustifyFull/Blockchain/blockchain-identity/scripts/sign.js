import { ethers } from "ethers";

// Test private key for account: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
const privateKey = "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
const message = "Authenticate with Trustify";

async function main() {
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signMessage(message);
    
    console.log("Message:", message);
    console.log("Wallet Address:", wallet.address);
    console.log("Signature:", signature);
    
    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log("\nVerification:");
    console.log("Recovered Address:", recoveredAddress);
    console.log("Matches:", recoveredAddress === wallet.address);
    
    console.log("\nFor Postman Headers:");
    console.log("walletaddress:", wallet.address);
    console.log("signature:", signature);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
