const { ethers, run, network } = require("hardhat"); // we import ethers from hardhat
// "run" allows us to run any hardhat task

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  // we create an instance of contract factory which is needed to deploy a contract
  // https://docs.ethers.io/v5/api/contract/contract-factory/

  console.log("Deploying contract");
  const simpleStorage = await SimpleStorageFactory.deploy();
  // .deploy() to deploy the contract with args for constructor, in this case we do not have constructor
  // this returns a contract which is stored in the variable simpleStorage

  await simpleStorage.deployed();

  console.log("Contract deployed to:", simpleStorage.address);

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    // if we are on rinkeby chain and ETHERSCAN_API_KEY exists, then:
    await simpleStorage.deployTransaction.wait(6);
    // If the Contract object is the result of a ContractFactory deployment, this is the transaction which was used to deploy the contract.
    // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse
    // we wait 6 blocks just in case, we give time to the contract to be deployed
    await verify(simpleStorage.address, []);
    // we verify the contract on etherscan with function verify
  }

  // let's interact with the contract

  const currentValue = await simpleStorage.retrieve();
  // we use the function retrieve() from the smart contract, and store the number in the variable
  console.log(`Current value is ${currentValue}`);

  const transactionResponse = await simpleStorage.store("7");
  // we use the function store() from the smart contract, and store the number 7
  // we store the transaction in the variable transactionResponse
  await transactionResponse.wait(1);
  // we wait 1 block till the transaction is mined
  const updatedValue = await simpleStorage.retrieve();
  // we use the function retrieve() from the smart contract, and store the number in the variable
  console.log(`New value is ${updatedValue}`);
}

// this function is for verifying automatically the contract on etherscan
// args are the arguments for the constructor
// we need the etherscan plugin from hardhat
// for that: yarn add --dev @nomiclabs/hardhat-etherscan
// then add on file hardhat.config.js : require("@nomiclabs/hardhat-etherscan");
async function verify(contractAddress, args) {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().include("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
