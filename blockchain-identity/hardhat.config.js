import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.19",
  networks: {
    skale: {
      url: process.env.RPC_URL || "https://testnet.skalenodes.com/v1/giant-half-dual-testnet",
      accounts: [process.env.PRIVATE_KEY],
      timeout: 60000,
      gasPrice: 0
    }
  }
};
