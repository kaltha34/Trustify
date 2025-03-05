const { ethers } = require("hardhat");
require("dotenv").config();

async function main(documentCID) {
  const contractAddress = "0xb9528Ba389CD58762E01B8e3feA73a2d1d3a0a9C"; // Replace with actual contract address
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
