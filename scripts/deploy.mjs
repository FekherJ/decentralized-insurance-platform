// scripts/deploy.mjs

import { ethers } from "hardhat";

async function main() {
  // Deploy the Mock Oracle
  const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
  const mockOracle = await MockV3Aggregator.deploy(8, 200000000000);  // 8 decimals, value = 200.00
  await mockOracle.deployed();

  console.log("Mock Oracle deployed to:", mockOracle.address);

  // Deploy the InsurancePolicy contract, passing the mock oracle address
  const InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
  const insurance = await InsurancePolicy.deploy(mockOracle.address);
  await insurance.deployed();

  console.log("InsurancePolicy deployed to:", insurance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
