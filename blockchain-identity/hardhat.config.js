require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    skale: {
      url: process.env.RPC_URL || "https://testnet.skalenodes.com/v1/giant-half-dual-testnet",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
