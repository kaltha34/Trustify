const { ethers } = require("hardhat");

async function main() {
  // Deploy IdentityVerification contract
  console.log("🔹 Deploying IdentityVerification contract...");
  const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
  const verificationContract = await IdentityVerification.deploy();
  await verificationContract.waitForDeployment();
  const verificationAddress = await verificationContract.getAddress();
  console.log("✅ IdentityVerification deployed at:", verificationAddress);

  // Deploy IdentityDocuments contract
  console.log("\n🔹 Deploying IdentityDocuments contract...");
  const IdentityDocuments = await ethers.getContractFactory("IdentityDocuments");
  const documentsContract = await IdentityDocuments.deploy();
  await documentsContract.waitForDeployment();
  const documentsAddress = await documentsContract.getAddress();
  console.log("✅ IdentityDocuments deployed at:", documentsAddress);

  console.log("\n📝 Contract Addresses:");
  console.log("IdentityVerification:", verificationAddress);
  console.log("IdentityDocuments:", documentsAddress);
  
  console.log("\n💡 Next steps:");
  console.log("1. Add these addresses to your .env file:");
  console.log(`VERIFICATION_CONTRACT=${verificationAddress}`);
  console.log(`DOCUMENTS_CONTRACT=${documentsAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment Error:", error);
    process.exit(1);
  });
