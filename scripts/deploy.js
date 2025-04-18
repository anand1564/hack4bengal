const hre = require("hardhat");

async function main() {
  const NFTEventTicketing = await hre.ethers.getContractFactory("NFTEventTicketing");
  const nftEventTicketing = await NFTEventTicketing.deploy();

  await nftEventTicketing.waitForDeployment(); // ⬅️ For Hardhat's new ethers

  console.log("NFTEventTicketing deployed to:", await nftEventTicketing.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
