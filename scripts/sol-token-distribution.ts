import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { NetworkType, getConnection, getTransactionExplorerUrl, getWallet } from "./helpers";
import SolTokenHelper from "./sol-token-helper";

const currentNetwork: NetworkType = "devnet" as NetworkType;

const connection = getConnection(currentNetwork);
// If local system wallet is needed ? Uncomment the following line
const serverWallet = await getWallet("~/.config/solana/id.json");

// const serverWallet = Keypair.generate();
const userKeypair = Keypair.generate();

const solTokenHelper = new SolTokenHelper(connection);

console.log("Server Account Public Key: ", serverWallet.publicKey.toBase58());
console.log("User Account Public Key: ", userKeypair.publicKey.toBase58());

let serverWalletInfo = await connection.getAccountInfo(serverWallet.publicKey, { commitment: "confirmed" });
let userWalletInfo = await connection.getAccountInfo(userKeypair.publicKey, { commitment: "confirmed" });

// Either get a airdrop manually or uncomment the following lines to get the airdrop automatically
// Note: If there is any error regarding rate limit for airdrop ? Please uncomment the following lines
// if (currentNetwork !== "mainnet" && ((serverWalletInfo?.lamports || 0) / LAMPORTS_PER_SOL) < 2) {
//     const airdropTx = await connection.requestAirdrop(serverWallet.publicKey, 2 * LAMPORTS_PER_SOL);

//     await connection.confirmTransaction(airdropTx);

//     console.log("Airdrop received for the Server wallet: ", getTransactionExplorerUrl(currentNetwork, airdropTx));

//     serverWalletInfo = await connection.getAccountInfo(serverWallet.publicKey, { commitment: "confirmed" });
// }

console.log("Server Account balance: ", (serverWalletInfo?.lamports || 0) / LAMPORTS_PER_SOL);
console.log("User Account balance: ", (userWalletInfo?.lamports || 0) / LAMPORTS_PER_SOL);

console.log("Started transfering the Solana Native token");

const transferTx = await solTokenHelper.transfer(serverWallet, userKeypair.publicKey, 0.01);

console.log("Solana Native token has been transferred: ", getTransactionExplorerUrl(currentNetwork, transferTx));

serverWalletInfo = await connection.getAccountInfo(serverWallet.publicKey, { commitment: "confirmed" });
userWalletInfo = await connection.getAccountInfo(userKeypair.publicKey, { commitment: "confirmed" });

console.log("Server Account balance: ", (serverWalletInfo?.lamports || 0) / LAMPORTS_PER_SOL);
console.log("User Account balance: ", (userWalletInfo?.lamports || 0) / LAMPORTS_PER_SOL);