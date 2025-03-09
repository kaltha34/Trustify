require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    skale: {
      url: process.env.RPC_URL || "https://testnet.skalenodes.com/v1/giant-half-dual-testnet",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      gas: 8000000,
      gasPrice: 0, // SKALE has 0 gas fees
      timeout: 60000 // Increase timeout for SKALE network
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
