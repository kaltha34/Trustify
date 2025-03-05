const hre = require("hardhat");

async function main() {
  const IdentityVerification = await hre.ethers.getContractFactory("IdentityVerification");
  const contract = await IdentityVerification.deploy(); // Deploy the contract

  await contract.waitForDeployment(); // Ensure correct deployment

  const contractAddress = await contract.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment Error:", error);
    process.exit(1);
  });
