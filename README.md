# Voting-Dapp

A basic *Decentralised Application* that runs on Ethereum virtual machine and uses Smart contracts for it's backend.

#### Steps to run Dapp on local server are as follows :-
1. Clone the project and go to the project directory on terminal.
2. Run *npm i* to install all the dependencies.
3. Run *npm i -g truffle* to install *Truffle*, a development environment, testing framework and asset pipeline for Ethereum.
4. Add Truffle to Environment variables.
5. Download and install *Ganache*, a local ethereum network for your computer. 
6. Run *Ganache* & add a workspace and in contracts at the top, select and add *truffle-config.js* from project directory.
6. Add *MetaMask* to your browser's extension and create an account in it.
8. While inside the project directory, run *truffle migrate* on terminal to deploy all contracts to the local ethereum network i.e. Ganache.
9. Finally, run *npm run dev* to launch the Dapp & start experimenting.
