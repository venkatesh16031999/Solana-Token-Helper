# Solana-Token-Helper

This repository contains the scripts for Solana token transfers. Three types of tokens are supported namely,
1. SPL Token
2. SPL Token Extensions or Token 2022
3. Solana Native Token

## Prerequisites:

### Installation:
Run `Yarn install` to install all the dependencies

### Solana Configuration:
Go [here](https://solana.com/docs/intro/installation) to configure Solana CLI and Solana Keypair

### Solana Network Selection
Solana has four networks - localnet, devnet, testnet, and mainnet.

You can use the following cmd to set the appropriate network in your CLI.
`solana config set --url <network_name>`

### Solana Wallet Airdrop
You can use the following cmd to get some Sol Native tokens for transactions,
`solana airdrop 2`

### SPL Token and Token22 Transfer:
To execute the SPL Token and Token22 transfer, use the following cmd
`esrun ./scripts/spl-token-distribution.ts`

### Solana Native Token Transfer:
To execute the Solana Native Token transfer, use the following cmd
`esrun ./scripts/sol-token-distribution.ts`
