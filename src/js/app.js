App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  voted: false,

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if (typeof web3 !== 'undefined') {
      // If a App instance is already provided by the Meta Task.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      //  Specify default instance if no web3 instance provided.
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Election.json', election => {
      // Instantiate a new Truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
    
      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
      
      App.contracts.Election.deployed()
      .then(instance => {
          instance.votedEvent({}).watch((error, event) => {
              console.log("event Triggered "+ event);
              
              // Reload when the new vote is recorded
              App.render();
              
          });
      });
  },

  render: function() {
      var electionInstance;
      var loader = $('#loader');
      var content = $('#content');

      loader.show();
      content.hide();

      // Load account data
      web3.eth.getCoinbase(function(error, account) {
        if(error === null) {
            App.account = account;
            $('#accountAddress').html("Your Account:" + account);
        }
      });

      // Load contract data
      App.contracts.Election.deployed()
      .then(instance => {
          electionInstance = instance;
          return electionInstance.candidatesCount();
      })
      .then(count => {
          var candidatesResults = $("#candidatesResults");
          candidatesResults.empty();

          var candidateSelect = $("#candidatesSelect");
          candidateSelect.empty();

          for(var i = 1; i<=count; i++) {
              electionInstance.candidates(i)
              .then(candidate => {
                  var id = candidate[0];
                  var name = candidate[1];
                  var voteCount = candidate[2];

                  // Render candidate results
                  var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>"+ voteCount +"</td></tr>";
                  candidatesResults.append(candidateTemplate);

                  // Render candidate ballot option
                  var candidateOption = "<option value = '"+id+"'>"+name+"</option>";
                  candidateSelect.append(candidateOption);
              });
          }
          return electionInstance.voters(App.account);
        })
        .then( hasVoted => {

          //App.voted = hasVoted;
          // Don't allow a user to vote
          if(hasVoted) {
            $('form').hide();
          }
          loader.hide();
          content.show();
      })
      .catch(err => {
          console.warn(err);
      });
  },

  castVote : function() {
      var candidateId = $("#candidatesSelect").val();

      App.contracts.Election.deployed()
      .then(instance => {
          return instance.vote(candidateId, { from: App.account });
      })
      .then(result => {

        $("#content").hide();
        $("#loader").show();
      })
      .catch(err => {
          console.error(err);
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
