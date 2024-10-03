import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { NetworkType, getConnection, getTransactionExplorerUrl, getWallet } from "./helpers";
import SplTokenHelper from "./spl-token-helper";

const currentNetwork: NetworkType = "devnet" as NetworkType;

const connection = getConnection(currentNetwork);
// If local system wallet is needed ? Uncomment the following line
const serverWallet = await getWallet("~/.config/solana/id.json");

// const serverWallet = Keypair.generate();
const userKeypair = Keypair.generate();

const initialAmountToMint = 1000000;

let serverWalletInfo = await connection.getAccountInfo(serverWallet.publicKey, { commitment: "confirmed" });

// Either get a airdrop manually or uncomment the following lines to get the airdrop automatically
// Note: If there is any error regarding rate limit for airdrop ? Please uncomment the following lines
// if (currentNetwork !== "mainnet" && ((serverWalletInfo?.lamports || 0) / LAMPORTS_PER_SOL) < 2) {
//     const airdropTx = await connection.requestAirdrop(serverWallet.publicKey, 2 * LAMPORTS_PER_SOL);

//     await connection.confirmTransaction(airdropTx);

//     console.log("Airdrop received for the Server wallet: ", getTransactionExplorerUrl(currentNetwork, airdropTx));

//     serverWalletInfo = await connection.getAccountInfo(serverWallet.publicKey, { commitment: "confirmed" });
// }

const splTokenHelper = new SplTokenHelper(connection);

const mintAccount = await splTokenHelper.createTokenMint("token", 9, serverWallet);
const mintAccountInfo = await splTokenHelper.getMintAccountInfo(mintAccount);
console.log("Mint Account Pubkey: ", mintAccountInfo.address.toBase58());

console.log("Server Account Public Key: ", serverWallet.publicKey.toBase58());

let associatedTokenAccountForServer = await splTokenHelper.getAssociatedTokenAccount(mintAccount, serverWallet.publicKey, serverWallet);
console.log("Associated Token Account Public Key (Server): ", associatedTokenAccountForServer.address.toBase58());

console.log("User Account Public Key: ", userKeypair.publicKey.toBase58());

let associatedTokenAccountForUser = await splTokenHelper.getAssociatedTokenAccount(mintAccount, userKeypair.publicKey, serverWallet);
console.log("Associated Token Account Public Key (User): ", associatedTokenAccountForUser.address.toBase58());

console.log("Started minting the SPL token");

const mintTx = await splTokenHelper.mintToken(mintAccount, associatedTokenAccountForServer, initialAmountToMint, serverWallet);

console.log("SPL token has been minted: ", getTransactionExplorerUrl(currentNetwork, mintTx));

// await splTokenHelper.mintToken(mintAccount, associatedTokenAccountForUser, 150, serverWallet);

associatedTokenAccountForServer = await splTokenHelper.getAssociatedTokenAccount(mintAccount, serverWallet.publicKey, serverWallet);
console.log("Server Account balance: ", associatedTokenAccountForServer.amount);

associatedTokenAccountForUser = await splTokenHelper.getAssociatedTokenAccount(mintAccount, userKeypair.publicKey, serverWallet);
console.log("User Account balance: ", associatedTokenAccountForUser.amount);

console.log("Started transfering the SPL token");

const transferTx = await splTokenHelper.transferToken(mintAccount, associatedTokenAccountForServer.address, associatedTokenAccountForUser.address, 50, serverWallet);

console.log("SPL token has been transferred: ", getTransactionExplorerUrl(currentNetwork, transferTx));

associatedTokenAccountForServer = await splTokenHelper.getAssociatedTokenAccount(mintAccount, serverWallet.publicKey, serverWallet);
console.log("Server Account balance: ", associatedTokenAccountForServer.amount);

associatedTokenAccountForUser = await splTokenHelper.getAssociatedTokenAccount(mintAccount, userKeypair.publicKey, serverWallet);
console.log("User Account balance: ", associatedTokenAccountForUser.amount);

