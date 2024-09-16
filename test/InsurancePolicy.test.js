import { expect } from "chai";
import { ethers } from "ethers";  // Import ethers directly from ethers library
import hardhat from "hardhat";

const { ethers: hardhatEthers } = hardhat;  // Using hardhatEthers to differentiate from imported ethers

describe("InsurancePolicy", function () {
  let mockV3Aggregator;
  let insurancePolicy;

  beforeEach(async function () {
    // Deploy MockV3Aggregator with 8 decimals and an initial answer of 2000 (e.g., $2000)
    const MockV3Aggregator = await hardhatEthers.getContractFactory("contracts/MockV3Aggregator.sol:MockV3Aggregator");

    mockV3Aggregator = await MockV3Aggregator.deploy(8, ethers.utils.parseUnits("2000", 8));  // Use ethers.utils.parseUnits directly

    await mockV3Aggregator.deployed(); // Ensure the mock is deployed

    // Deploy InsurancePolicy contract with the mock oracle's address
    const InsurancePolicy = await hardhatEthers.getContractFactory("InsurancePolicy");
    insurancePolicy = await InsurancePolicy.deploy(mockV3Aggregator.address);
    await insurancePolicy.deployed();  // Ensure it's deployed
  });

  it("Should allow policy creation and trigger a payout based on mock oracle data", async function () {
    const [owner, insured] = await hardhatEthers.getSigners();

    // Create a new policy
    await insurancePolicy.createPolicy(insured.address, ethers.utils.parseEther("1"), ethers.utils.parseEther("10"), "Storm");  // Use ethers.utils.parseEther directly

    // Check if policy was created
    const policy = await insurancePolicy.policies(0);
    expect(policy.insured).to.equal(insured.address);
    expect(policy.premium).to.equal(ethers.utils.parseEther("1"));

    // Trigger the payout by checking the external condition (mock oracle data)
    await insurancePolicy.checkExternalCondition(0, ethers.utils.parseUnits("2000", 8));  // Use ethers.utils.parseUnits directly

    // Ensure the policy was updated to inactive
    const updatedPolicy = await insurancePolicy.policies(0);
    expect(updatedPolicy.isActive).to.equal(false);
  });
});
