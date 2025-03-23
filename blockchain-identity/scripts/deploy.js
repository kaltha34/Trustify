import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Starting deployment...");

  // Deploy IdentityVerification
  console.log("\nDeploying IdentityVerification...");
  const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
  const verificationContract = await IdentityVerification.deploy();
  await verificationContract.deployed();
  console.log("IdentityVerification deployed to:", verificationContract.address);

  // Deploy IdentityDocuments
  console.log("\nDeploying IdentityDocuments...");
  const IdentityDocuments = await ethers.getContractFactory("IdentityDocuments");
  const documentsContract = await IdentityDocuments.deploy();
  await documentsContract.deployed();
  console.log("IdentityDocuments deployed to:", documentsContract.address);

  // Verify deployment
  console.log("\nVerifying deployments...");
  
  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Verify IdentityVerification
  const isVerifierInVerification = await verificationContract.verifiers(deployer.address);
  console.log("Deployer is verifier in IdentityVerification:", isVerifierInVerification);

  // Verify IdentityDocuments
  const isVerifierInDocuments = await documentsContract.verifiers(deployer.address);
  console.log("Deployer is verifier in IdentityDocuments:", isVerifierInDocuments);

  // Update environment variables
  console.log("\nUpdating environment variables...");
  console.log(`VERIFICATION_CONTRACT=${verificationContract.address}`);
  console.log(`DOCUMENTS_CONTRACT=${documentsContract.address}`);

  console.log("\nDeployment completed!");
  console.log("Contract Addresses:");
  console.log("IdentityVerification:", verificationContract.address);
  console.log("IdentityDocuments:", documentsContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
