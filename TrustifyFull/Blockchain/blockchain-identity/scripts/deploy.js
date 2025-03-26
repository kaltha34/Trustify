const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const IdentityVerification = await hre.ethers.getContractFactory("IdentityVerification");

  // Deploy the contract
  console.log("Deploying contract...");
  const identityVerification = await IdentityVerification.deploy();

  // Wait for deployment to finish
  await identityVerification.deployed();

  console.log("IdentityVerification deployed to:", identityVerification.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
