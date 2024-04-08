// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions
contract Evoting is Context, AccessControl {
    /**
     * Erros *
     */
    error Evoting__RegistrationClosed();
    error Evoting__NotOpenForVote();
    error Evoting__OnlyOwner();
    error Evoting__OnlyVoter();
    error Evoting__AlreadyVoted();
    error Evoting__AlreadyRegistered();

    /**
     * Type declarations *
     */

    using Counters for Counters.Counter;

    bytes32 ADMIN_ROLE = keccak256("ADMIN_ROLE");
    enum ELECTION_STAGES {
        OPEN_FOR_REGISTRATION,
        OPEN_FOR_VOTING,
        ELECTION_ENDED
    }

    struct Candidate {
        string name;
        string party;
        bytes32 candidateIdHash; // keccak256 hash of address as id
        uint256 votes; // votes count
        uint256 regId;
    }

    struct Election {
        uint256 id;
        string electionName;
        uint256 duration; // election duration, will be set onces candidates are registered
        ELECTION_STAGES stage;
    }

    struct Voter {
        bool isRegistered;
        address account;
    }

    /**
     * State Variables *
     */

    Counters.Counter private _electionsCounter;
    Counters.Counter private _votersCounter;

    address public owner;
    Election[] private elections;
    Voter[] private voters;
    mapping(address => uint) private votersToIndex; // mapping for voters
    mapping(uint256 => Candidate) public electionWinner; // electionId to winner
    mapping(uint256 => Candidate[]) private electionCandidates;
    mapping(uint256 => mapping(bytes32 => bool)) private isCandidateRegistered;
    mapping(uint256 => mapping(address => bool)) private votersToVoteStatus;

    /**
     * Events *
     */
    event CreatedElection(uint256 indexed electionId);
    event VoterRegistered(address indexed voter);

    /**
     * Modifiers *
     */
    modifier onlyOpenForRegistrationElection(uint256 _electionId) {
        Election memory _election = elections[_electionId];

        if (_election.stage != ELECTION_STAGES.OPEN_FOR_REGISTRATION)
            revert Evoting__RegistrationClosed();

        _;
    }
    modifier onlyOpenForVotingElection(uint256 _electionId) {
        Election memory _election = elections[_electionId];

        if (_election.stage != ELECTION_STAGES.OPEN_FOR_VOTING)
            revert Evoting__NotOpenForVote();

        _;
    }

    modifier onlyOwner() {
        if (!hasRole(ADMIN_ROLE, _msgSender())) revert Evoting__OnlyOwner();

        _;
    }

    modifier onlyVoter(uint256 _electionId) {
        uint _voterIndex = votersToIndex[_msgSender()];
        Voter memory _voterInfo = voters[_voterIndex];

        if (!_voterInfo.isRegistered || _voterInfo.account != _msgSender())
            revert Evoting__OnlyVoter();
        if (votersToVoteStatus[_electionId][_msgSender()])
            revert Evoting__AlreadyVoted();
        _;
    }

    /**
     * Constructor *
     */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(ADMIN_ROLE, _msgSender());
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        owner = _msgSender();
    }

    /**
     * Functions *
     */
    function createElection(string memory _electionName) external onlyOwner {
        uint256 _electionId = _electionsCounter.current();
        _electionsCounter.increment(); // increment election counter

        Election memory election = Election({
            id: _electionId,
            electionName: _electionName,
            duration: 0,
            stage: ELECTION_STAGES.OPEN_FOR_REGISTRATION
        });

        elections.push(election);

        emit CreatedElection(_electionId);
    }

    function registerCandidatesToElection(
        string memory _candidateName,
        string memory _party,
        bytes32 candidateIdHash,
        uint256 _electionId
    ) external onlyOwner onlyOpenForRegistrationElection(_electionId) {
        if (isCandidateRegistered[_electionId][candidateIdHash])
            revert Evoting__AlreadyRegistered();

        isCandidateRegistered[_electionId][candidateIdHash] = true;

        uint256 candidatesLength = electionCandidates[_electionId].length;

        Candidate memory _candidate = Candidate({
            name: _candidateName,
            party: _party,
            candidateIdHash: candidateIdHash,
            votes: 0,
            regId: candidatesLength
        });

        electionCandidates[_electionId].push(_candidate);
    }

    function startElection(
        uint256 _durationInSecond,
        uint256 _electionId
    ) external onlyOwner onlyOpenForRegistrationElection(_electionId) {
        Election memory _election = elections[_electionId];
        require(electionCandidates[_election.id].length > 0, "no candidates");

        uint256 duration = block.timestamp + _durationInSecond;
        _election.duration = duration;
        _election.stage = ELECTION_STAGES.OPEN_FOR_VOTING;
        elections[_electionId] = _election;
    }

    function endElection(
        uint256 _electionId
    ) external onlyOwner onlyOpenForVotingElection(_electionId) {
        elections[_electionId].stage = ELECTION_STAGES.ELECTION_ENDED; // end election

        Candidate[] memory candidates = electionCandidates[_electionId];

        uint256 firstHighest;
        uint256 secondHighest;
        uint256 winningCandidateIndex;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].votes >= firstHighest) {
                winningCandidateIndex = i;
                secondHighest = firstHighest;
                firstHighest = candidates[i].votes;
            }
        }

        bool isElectionTied = firstHighest == secondHighest;

        if (!isElectionTied) {
            electionWinner[_electionId] = candidates[winningCandidateIndex];
        }
    }

    function vote(
        uint256 _candidateId,
        uint256 _electionId
    ) external onlyVoter(_electionId) onlyOpenForVotingElection(_electionId) {
        Election memory _election = elections[_electionId];

        require(block.timestamp < _election.duration, "Election time over");

        votersToVoteStatus[_electionId][_msgSender()] = true;

        uint256 _totalVotes = electionCandidates[_electionId][_candidateId]
            .votes;
        electionCandidates[_electionId][_candidateId].votes = _totalVotes + 1;
    }

    function registerVoter(address _account) external onlyOwner {
        uint256 _voterIndex = votersToIndex[_account];

        if (voters.length > 0 && voters[_voterIndex].account == _account)
            revert Evoting__AlreadyRegistered();

        uint256 _voterIdx = _votersCounter.current();
        votersToIndex[_account] = _voterIdx;
        _votersCounter.increment();
        voters.push(Voter(true, _account));

        emit VoterRegistered(_account);
    }

    /**
     * View Functions *
     */
    function getElectionById(
        uint256 _electionId
    ) external view returns (Election memory) {
        return elections[_electionId];
    }

    function getElections() external view returns (Election[] memory) {
        return elections;
    }

    function getElectionCandidates(
        uint256 _electionId
    ) external view returns (Candidate[] memory) {
        return electionCandidates[_electionId];
    }

    function getElectionToCandidates(
        uint256 _electionId
    ) external view returns (Candidate[] memory candidates) {
        candidates = electionCandidates[_electionId];
    }

    function getVoters() external view returns (Voter[] memory) {
        return voters;
    }

    function getVoterVoteStatus(
        uint256 _electionId,
        address _account
    ) external view returns (bool) {
        return votersToVoteStatus[_electionId][_account];
    }
}
