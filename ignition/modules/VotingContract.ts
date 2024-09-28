import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// const ONE_GWEI: bigint = 1_000_000_000n;

const VotingModule = buildModule("VotingContractModule", (m) => {
  // const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  const voting = m.contract("Create", []);

  return { voting };
});

export default VotingModule;
