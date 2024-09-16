import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@chainlink/contracts";

export default {
  solidity: "0.8.24", 
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // Add other networks if necessary (e.g., Rinkeby, Mainnet)
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: "your-etherscan-api-key",
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: "your-coinmarketcap-api-key",
  },
};
