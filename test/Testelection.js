var Election = artifacts.require("Election.sol");

contract("Election", accounts => {
    var electionInstance;
    var candidateId;

    it("initialises with two candidates", () => {
        return Election.deployed()
            .then(instance => {
                    return instance.candidatesCount();
            })
            .then(count => {
                assert.equal(count,2);
            });
    });

    it("initialises the candidates with correct values", () => {
        return Election.deployed()
            .then(instance => {
                electionInstance = instance;
                return electionInstance.candidates(1);
            })
            .then(candidate1 => {
                assert.equal(candidate1.name, "Candidate 1");
                assert.equal(candidate1.id, 1);
                assert.equal(candidate1.voteCount, 0);

                return electionInstance.candidates(2);
            })
            .then(candidate2 => {
                assert.equal(candidate2.name, "Candidate 2");
                assert.equal(candidate2.id, 2);
                assert.equal(candidate2.voteCount, 0);
            });
    });

    it("allows a voter to cast a vote", () => {
        return Election.deployed()
            .then(instance => {
                electionInstance = instance;
                candidateId = 1;
                return electionInstance.vote(candidateId, { from: accounts[3] });
            })
            .then(reciept => {
                assert.equal(reciept.logs.length, 1, "An event was triggered");
                assert.equal(reciept.logs[0].event, "votedEvent", "the event type is correct.");
                assert.equal(reciept.logs[0].args._candidateId.toNumber(), candidateId, "The id also matches.")
                return electionInstance.voters(accounts[3]);
            })
            .then(voted => {
                assert.equal(voted, true, "voter has been marked.");
                return electionInstance.candidates(candidateId);
            })
            .then(candidate => {
                assert.equal(candidate[2], 1, "Increments the vote count.");
            });
    });
});