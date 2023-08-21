const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const DynamicToken = await hre.ethers.getContractFactory("DynamicToken");
  const dyn = await DynamicToken.deploy();
  await dyn.deployed();

  const NFTEE = await hre.ethers.getContractFactory("NFTEE");
  const nftee = await NFTEE.deploy();
  await nftee.deployed();

  console.log("NFTEE deployed to:", nftee.address);

  console.log("DynamicToken deployed to:", dyn.address);
  console.log(
    `If it is in mumbai: https://mumbai.polygonscan.com/address/${dyn.address}`
  );

  fs.writeFileSync(
    "./config.js",
    `export const Address = "${dyn.address}";\nexport const nftAddress = "${nftee.address}";`
     
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
