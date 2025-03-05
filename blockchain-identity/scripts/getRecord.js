const { ethers } = require("hardhat");
require("dotenv").config();

async function main(documentCID) {
  const contractAddress = "0x21CE0dE1A8906D7Ae539055F23D314a133Dd66e0"; // Replace with actual contract address
  const contractABI = require("../artifacts/contracts/IdentityVerification.sol/IdentityVerification.json").abi;

  const provider = new ethers.JsonRpcProvider(process.env.SKALE_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    const record = await contract.getRecord(documentCID);
    console.log(`📜 Document CID: ${record[0]}`);
    console.log(`📌 Status: ${record[1]}`);
    console.log(`👤 Added By: ${record[2]}`);

    console.log(`🔗 Fetch Document: https://${record[0]}.ipfs.w3s.link`);
  } catch (error) {
    console.error("❌ Error fetching record:", error);
  }
}

const documentCID = process.argv[2];
if (!documentCID) {
  console.error("❌ Please provide a document CID.");
  process.exit(1);
}

main(documentCID);
