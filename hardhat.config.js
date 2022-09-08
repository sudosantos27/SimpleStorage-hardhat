require("@nomiclabs/hardhat-waffle");
require("dotenv").config();   // added after: yarn add --dev dotenv
require("@nomiclabs/hardhat-etherscan");
require("./tasks/block-number");  // we need this in order to use the new task  we created
require("hardhat-gas-reporter");  // displays the info when I test
require("solidity-coverage");     // yarn add --dev solidity-coverage. Tells you which lines of contract are not tested. yarn hardhat coverage

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;  // we store the URL in a variable
// we need to write in the terminal: yarn add --dev dotenv, to pull info from .env

const PRIVATE_KEY = process.env.PRIVATE_KEY;  // this is from metamask account

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;  // import apikey from etherscan to verify
module.exports = {
  defaultNetwork: "hardhat", // hardhat comes with a fake blockchain by default, it's called hardhat, writing this is unnecessary 
  networks: {       // we can add any network we want
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",  // the one you see after: yarn hardhat node
      chainId: 31337, // same chainId as Hardhat
    }
  },
  solidity: "0.8.8",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {    // gas reporter to see how much gas I use in each function: yarn add hardhat-gas-reporter --dev 
    enabled: true,
    outputFile: "gas-report.txt",  
    noColors: true,
    currency: "USD",  // to see gas prices in USD we need coinmarketcap API
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC"  // we can choose which blockchain we want to see
  },
};
