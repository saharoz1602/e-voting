const { keccak256, toBytes } = require("viem");

export const ADMIN_ROLE = keccak256(toBytes("ADMIN_ROLE"));

export const ELECTION_STAGES = {
  0: "Open For Rregsitation",
  1: "Open for Voting",
  2: "Election Ended",
};
