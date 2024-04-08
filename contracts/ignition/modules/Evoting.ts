import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// You can deploy it using npx hardhat ignition deploy ./ignition/modules/Lock.ts:

const EvotingModule = buildModule("EvotingModule", (m) => {
  const evoting = m.contract("Evoting");

  return { evoting };
});

export default EvotingModule;
