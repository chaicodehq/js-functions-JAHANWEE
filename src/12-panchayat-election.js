/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Your code here
  let votes = {};
  let registered = [];
  let voted = [];

  return {
    registerVoter(voter) {
      if (!voter) return false;

      if (!voter.id || !voter.name || typeof voter.age !== "number") {
        return false;
      }

      if (voter.age < 18) return false;
      for (let i = 0; i < registered.length; i++) {
        if (registered[i] === voter.id) return false;
      }

      registered.push(voter.id);
      return true;
    },

    castVote(voterId, candidateId, onSuccess, onError) {

      let isRegistered = false;
      for (let i = 0; i < registered.length; i++) {
        if (registered[i] === voterId) isRegistered = true;
      }
      if (!isRegistered) return onError("Voter not registered");

      for (let i = 0; i < voted.length; i++) {
        if (voted[i] === voterId) return onError("Already voted");
      }

      let candidateFound = false;
      for (let i = 0; i < candidates.length; i++) {
        if (candidates[i].id === candidateId) candidateFound = true;
      }
      if (!candidateFound) return onError("Candidate not found");
      if (!votes[candidateId]) votes[candidateId] = 0;
      votes[candidateId] = votes[candidateId] + 1;

      voted.push(voterId);

      return onSuccess({ voterId: voterId, candidateId: candidateId });
    },

    getResults(sortFn) {

      let results = [];

      for (let i = 0; i < candidates.length; i++) {
        let c = candidates[i];

        results.push({
          id: c.id,
          name: c.name,
          party: c.party,
          votes: votes[c.id] || 0
        });
      }

      if (sortFn) {
        results.sort(sortFn);
      } else {
        results.sort(function (a, b) {
          return b.votes - a.votes;
        });
      }

      return results;
    },

    getWinner() {

      let results = this.getResults();

      if (results.length === 0 || results[0].votes === 0) {
        return null;
      }

      return results[0];
    }

  };
}



export function createVoteValidator(rules) {
  // Your code here
  return function (voter) {

    if (!voter) return { valid: false, reason: "Invalid voter" };
    for (let i = 0; i < rules.requiredFields.length; i++) {
      let field = rules.requiredFields[i];

      if (!(field in voter)) {
        return { valid: false, reason: field + " missing" };
      }
    }

    if (voter.age < rules.minAge) {
      return { valid: false, reason: "Underage" };
    }

    return { valid: true };
  };
}


export function countVotesInRegions(regionTree) {
  // Your code here
  if (!regionTree) return 0;
  let total = regionTree.votes || 0;

  if (regionTree.subRegions) {
    for (let i = 0; i < regionTree.subRegions.length; i++) {
      total += countVotesInRegions(regionTree.subRegions[i]);
    }
  }

  return total;
}


export function tallyPure(currentTally, candidateId) {
  // Your code here
  let newTally = {};

  for (let key in currentTally) {
    newTally[key] = currentTally[key];
  }

  if (newTally[candidateId]) {
    newTally[candidateId] = newTally[candidateId] + 1;
  } else {
    newTally[candidateId] = 1;
  }

  return newTally;
}

