const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // If CONTRACT_ADDRESS is set in .env, attach to it; otherwise deploy a new contract
  const envAddress = process.env.CONTRACT_ADDRESS && process.env.CONTRACT_ADDRESS !== "" ? process.env.CONTRACT_ADDRESS : null;
  const CarbonCredit = await hre.ethers.getContractFactory("CarbonCredit");
  let carbonCredit;
  let contractAddress;

  if (envAddress) {
    carbonCredit = CarbonCredit.attach(envAddress);
    contractAddress = envAddress;
    console.log("Attached to existing contract:", contractAddress);
  } else {
    console.log("No CONTRACT_ADDRESS in .env — deploying a fresh contract for tracking tests.");
    carbonCredit = await CarbonCredit.deploy();
    await carbonCredit.waitForDeployment();
    contractAddress = await carbonCredit.getAddress();
    console.log("Deployed contract:", contractAddress);
  }

  const [owner] = await hre.ethers.getSigners();

  console.log("\n=== CARBON CREDIT TRACKER ===\n");
  console.log("Owner Address:", owner.address);
  console.log("Contract Address:", contractAddress);

  // Issue some credits
  console.log("\n--- Issuing Credits ---");
  const issueTx = await carbonCredit.issueCredits(owner.address, hre.ethers.parseUnits("1000", 18));
  const issueReceipt = await issueTx.wait();
  console.log("✓ Issued 1000 tokens");
  console.log("Transaction Hash:", issueReceipt.hash);
  console.log("Block Number:", issueReceipt.blockNumber);
  console.log("Gas Used:", issueReceipt.gasUsed.toString());

  // Get token balance
  console.log("\n--- Token Balance ---");
  const balance = await carbonCredit.balanceOf(owner.address);
  console.log("Balance:", hre.ethers.formatUnits(balance, 18), "CO2C");

  // Retire some credits
  console.log("\n--- Retiring Credits ---");
  const retireTx = await carbonCredit.retireCredits(hre.ethers.parseUnits("100", 18));
  const retireReceipt = await retireTx.wait();
  console.log("✓ Retired 100 tokens");
  console.log("Transaction Hash:", retireReceipt.hash);
  console.log("Block Number:", retireReceipt.blockNumber);

  // Get updated balance
  const newBalance = await carbonCredit.balanceOf(owner.address);
  console.log("Updated Balance:", hre.ethers.formatUnits(newBalance, 18), "CO2C");

  // Offset carbon
  console.log("\n--- Offsetting Carbon ---");
  const offsetTx = await carbonCredit.offsetCarbon(owner.address, 5); // 5 tons
  const offsetReceipt = await offsetTx.wait();
  console.log("✓ Offset 5 tons of CO2 (50 tokens used)");
  console.log("Transaction Hash:", offsetReceipt.hash);
  console.log("Block Number:", offsetReceipt.blockNumber);

  // Get final balance
  const finalBalance = await carbonCredit.balanceOf(owner.address);
  console.log("Final Balance:", hre.ethers.formatUnits(finalBalance, 18), "CO2C");

  // Get events
  console.log("\n--- Event Logs ---");
  const issueEvents = await carbonCredit.queryFilter("CreditsIssued");
  const retireEvents = await carbonCredit.queryFilter("CreditsRetired");
  const offsetEvents = await carbonCredit.queryFilter("CarbonOffsetted");

  console.log("\nCreditsIssued Events:", issueEvents.length);
  issueEvents.forEach((event, i) => {
    console.log(`  ${i + 1}. To: ${event.args[0]}, Amount: ${hre.ethers.formatUnits(event.args[1], 18)}`);
  });

  console.log("\nCreditsRetired Events:", retireEvents.length);
  retireEvents.forEach((event, i) => {
    console.log(`  ${i + 1}. From: ${event.args[0]}, Amount: ${hre.ethers.formatUnits(event.args[1], 18)}`);
  });

  console.log("\nCarbonOffsetted Events:", offsetEvents.length);
  offsetEvents.forEach((event, i) => {
    console.log(`  ${i + 1}. User: ${event.args[0]}, Tons: ${event.args[1]}, Tokens Used: ${hre.ethers.formatUnits(event.args[2], 18)}`);
  });

  console.log("\n=== END OF REPORT ===\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
