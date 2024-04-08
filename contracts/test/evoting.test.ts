import {
  loadFixture,
  mine,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Evoting } from "../typechain-types";

describe("Evoting", function () {
  const ElectionStages = {
    OPEN_FOR_REGISTRATION: 0,
    OPEN_FOR_VOTING: 1,
    ELECTION_ENDED: 2,
  };
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEvotingFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, voter] = await ethers.getSigners();

    const Evoting = await ethers.getContractFactory("Evoting");
    const evoting = await Evoting.deploy();

    return { evoting, owner, voter };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner, evoting } = await loadFixture(deployEvotingFixture);

      expect(await evoting.owner()).eq(owner);
    });
  });

  describe("Check election Functions", function () {
    let evoting: Evoting;
    let voter: any;

    async function registerCandidatesToElection() {
      const [election] = await evoting.getElections();

      await evoting.registerCandidatesToElection(
        "John Doe",
        "JD",
        ethers.keccak256(ethers.toUtf8Bytes("candidate1")),
        election.id
      );
    }
    beforeEach(async function () {
      const { evoting: _evoting, voter: _voter } = await loadFixture(
        deployEvotingFixture
      );
      evoting = _evoting;
      voter = _voter;
      await evoting.createElection("General Election");
    });

    it("should create an election", async function () {
      const elections = await evoting.getElections();

      expect(elections.length).eq(1);
      expect(elections[0].electionName).eq("General Election");
    });

    it("should register a candidate to an election", async function () {
      await registerCandidatesToElection();
      const [election] = await evoting.getElections();

      const candidates = await evoting.getElectionCandidates(election.id);
      expect(candidates.length).eq(1);
      expect(candidates[0].name).eq("John Doe");
    });

    it("should start an election", async function () {
      await registerCandidatesToElection();

      const [election] = await evoting.getElections();
      await evoting.startElection(3600, election.id);

      const updatedElection = await evoting.getElectionById(election.id);
      expect(updatedElection.stage).equal(ElectionStages.OPEN_FOR_VOTING);
    });

    it("should end an election and declare a winner", async function () {
      await registerCandidatesToElection();

      // voters registration
      await evoting.registerVoter(voter.address);

      const [election] = await evoting.getElections();
      await evoting.startElection(3600, election.id);

      // setup voting
      const candidateId = 0;
      const electionId = 0;
      await evoting.connect(voter).vote(candidateId, electionId);

      await mine(10);

      await evoting.endElection(election.id);

      const winner = await evoting.electionWinner(election.id);
      expect(winner.name).equal("John Doe");
    });
  });
});
