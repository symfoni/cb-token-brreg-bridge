# DSP & Brreg Bridge

A "chain universal" bridge that lets you move DSP tokens from one chain to another all while respecting VC registry from source chain.

Features
- Can be used in any direction on suppported chains through configuration patterns.
- Only one transaction needed from the user to deposit and withdraw tokens.
- Sync runs each minute. Can be invoked by API.
- Created for ease of use, not security.


# Run locally
You need a local blockchain. You can spin up all contracts and local blockchain in this project: https://github.com/symfoni/cb-token-brreg-bridge-contracts

You will also need connections to other chains, fill out these in .env variables.

1. `cp .env.example .env` and fill in env variables.
2. `yarn install`
3. `yarn dev`


# Sync VC registry

![Diagram showing how VC registry sync works](images/job_authenticate.png)

# Deposit tokens

![Diagram showing deposits work](images/job_deposit.png)

# Withdraw tokens

![Diagram showing withdraws work](images/job_withdraw.png)



# FAQ

## Supported chains
- Besu
- Hardhat
- Arbitrum Göerli 
- Possible others also...