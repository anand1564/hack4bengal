require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/Q5Jhi9asCqRNQeusKSLGT-f0488CZFRG", // or Alchemy
      accounts: [""]
    }
  }
};
