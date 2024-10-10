import { Checker, CompilerOutput } from '@/lib/interfaces'

export const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoyalSelection {
    struct Candidate {
        uint256 id;
        uint256 votes;
        string name;
        string description;
        string imageUrl;
    }

    Candidate[] public candidates;
    // end time of the election
    uint256 public endTime;

    constructor(Candidate[] memory _candidates, uint256 _endTime) {
        endTime = _endTime;
        for (uint i = 0; i < _candidates.length; i++) {
            candidates.push(Candidate(
                _candidates[i].id,
                0, // Initialize votes to 0
                _candidates[i].name,
                _candidates[i].description,
                _candidates[i].imageUrl
            ));
        }
    }


    /**
     * @dev Get all candidates
     * @return results An array of candidates
     */
    function getAllCandidates() public view returns (Candidate[] memory results) {
        return results;
    }

    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId The id of the candidate
     */
    function castVote(uint256 _candidateId) public {
        require(block.timestamp < endTime, "Voting has ended");
        // add logic to prevent multiple votes from the same address
        // add logic to increment the votes of the candidate
    }
}

`

export const solution = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoyalSelection {
    struct Candidate {
        uint256 id;
        uint256 votes;
        string name;
        string description;
        string imageUrl;
    }

    Candidate[] public candidates;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    // end time of the election
    uint256 public endTime;

    constructor(Candidate[] memory _candidates, uint256 _endTime) {
        endTime = _endTime;
        for (uint i = 0; i < _candidates.length; i++) {
            candidates.push(Candidate(
                _candidates[i].id,
                0, // Initialize votes to 0
                _candidates[i].name,
                _candidates[i].description,
                _candidates[i].imageUrl
            ));
        }
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function castVote(uint256 _candidateId) public {
        require(block.timestamp < endTime, "Voting has ended");
        require(!hasVoted[msg.sender][_candidateId], "You have already voted for this candidate");
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == _candidateId) {
                candidates[i].votes++;
                
                // update hasVoted mapping
                hasVoted[msg.sender][_candidateId] = true;
                break;
            }
        }
    }
}

`

export const checker: Checker = async (output: CompilerOutput) => {
  return [false, '']
}
