import { ASSOCIATED_TOKEN_PROGRAM_ID, Account, Mint, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, createMint, getMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import { TokenProgramType } from "./helpers"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TransactionSignature } from "@solana/web3.js";

class SplTokenHelper {
    connection: Connection;

    constructor (connection: Connection) {
        this.connection = connection;
    }

    async getTokenProgramTypeByTokenMintAccount(mintAccount: PublicKey): Promise<TokenProgramType> {
        const parsedAccountInfo = await this.connection.getParsedAccountInfo(mintAccount);
    
        if (!parsedAccountInfo.value) {
            throw new Error(`Account not found`);
        }
    
        if (parsedAccountInfo.value.owner.toBase58() === TOKEN_PROGRAM_ID.toBase58()) {
            return "token";
        } else if (parsedAccountInfo.value.owner.toBase58() === TOKEN_2022_PROGRAM_ID.toBase58()) {
            return "token_22";
        } else {
            throw new Error(`Invalid token account`);
        }
    }
    
    async getMintAccountInfo(mintAccount: PublicKey): Promise<Mint> {
        const tokenProgramType = await this.getTokenProgramTypeByTokenMintAccount(mintAccount);

        return await getMint(
            this.connection,
            mintAccount,
            "confirmed",
            tokenProgramType === "token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
        );
    }
    
    async createTokenMint(tokenProgramType: TokenProgramType, decimals: number, payer: Keypair): Promise<PublicKey> {
        return await createMint(
            this.connection,
            payer,
            payer.publicKey,
            payer.publicKey,
            decimals,
            undefined,
            { commitment: "confirmed" },
            tokenProgramType === "token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
        );
    }
    
    async getAssociatedTokenAccount(mintAccount: PublicKey, userAccount: PublicKey, payer: Keypair): Promise<Account> {
        const tokenProgramType = await this.getTokenProgramTypeByTokenMintAccount(mintAccount);
    
        return await getOrCreateAssociatedTokenAccount(
            this.connection,
            payer,
            mintAccount,
            userAccount,
            true,
            "confirmed",
            { commitment: "confirmed" },
            tokenProgramType === "token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
    }

    async mintToken(mintAccount: PublicKey, userAtaAccount: Account, amount: number, payer: Keypair): Promise<TransactionSignature> {
        const tokenProgramType = await this.getTokenProgramTypeByTokenMintAccount(mintAccount);
        
        return await mintTo(
            this.connection,
            payer,
            mintAccount,
            userAtaAccount.address,
            payer,
            amount * LAMPORTS_PER_SOL,
            [payer],
            { commitment: "confirmed" },
            tokenProgramType === "token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
        );
    }

    async transferToken(mintAccount: PublicKey, fromAtaAccount: PublicKey, toAtaAccount: PublicKey, amount: number, payer: Keypair): Promise<TransactionSignature> {
        const tokenProgramType = await this.getTokenProgramTypeByTokenMintAccount(mintAccount);
    
        return await transfer(
            this.connection,
            payer,
            fromAtaAccount,
            toAtaAccount,
            payer.publicKey,
            amount * LAMPORTS_PER_SOL,
            [payer],
            { commitment: "confirmed" },
            tokenProgramType === "token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
        );
    }
}

export default SplTokenHelper;