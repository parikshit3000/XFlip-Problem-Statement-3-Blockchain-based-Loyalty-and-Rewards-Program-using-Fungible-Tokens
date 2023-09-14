const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const DynamicToken = await hre.ethers.getContractFactory("DynamicToken");
  const dyn = await DynamicToken.deploy();
  await dyn.deployed();

  const NFTEE = await hre.ethers.getContractFactory("NFTEE");
  const nftee = await NFTEE.deploy();
  await nftee.deployed();

  const XFlip = await hre.ethers.getContractFactory("XFlipToken");
  const cap = ethers.utils.parseEther("1000000000");
  const xflip = await XFlip.deploy(cap)
  await xflip.deployed();

  console.log("NFTEE deployed to:", nftee.address);

  console.log("DynamicToken deployed to:", dyn.address);

  console.log("XFlip deployed to:", xflip.address);

  fs.writeFileSync(
    "./config.js",
    `export const Address = "${dyn.address}";\nexport const nftAddress = "${nftee.address}";\nexport const xflipAddress = "${xflip.address}";`
     
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
