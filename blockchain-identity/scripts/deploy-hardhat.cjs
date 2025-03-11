const hre = require("hardhat");

async function main() {
  console.log('🔹 Deploying IdentityDocuments contract...');
  
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(balance), 'SKALE');

  const IdentityDocuments = await hre.ethers.getContractFactory("IdentityDocuments");
  const contract = await IdentityDocuments.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log('✅ Contract deployed to:', contractAddress);

  // Update .env file
  const fs = require('fs');
  const envPath = './.env';
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update or add DOCUMENTS_CONTRACT
  if (envContent.includes('DOCUMENTS_CONTRACT=')) {
    envContent = envContent.replace(
      /DOCUMENTS_CONTRACT=.*/,
      `DOCUMENTS_CONTRACT="${contractAddress}"`
    );
  } else {
    envContent += `\nDOCUMENTS_CONTRACT="${contractAddress}"\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env with new contract address');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
