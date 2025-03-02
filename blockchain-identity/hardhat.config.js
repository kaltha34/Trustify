require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    skale: {
      url: "https://testnet.skalenodes.com/v1/giant-half-dual-testnet",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      gas: "auto", // Let the network handle gas
      gasPrice: "auto", // Remove manual gasPrice settings
    },
  },
};
