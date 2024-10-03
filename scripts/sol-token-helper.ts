import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionSignature, sendAndConfirmTransaction } from "@solana/web3.js";

class SolTokenHelper {
    connection: Connection;

    constructor (connection: Connection) {
        this.connection = connection;
    }

    async transfer(fromAccount: Keypair, toAccount: PublicKey, amount: number): Promise<TransactionSignature> {
        const transferIx = await SystemProgram.transfer({
            fromPubkey: fromAccount.publicKey,
            toPubkey: toAccount,
            lamports: amount * LAMPORTS_PER_SOL
        });

        const transaction = new Transaction().add(
            transferIx
        );

        return await sendAndConfirmTransaction(this.connection, transaction, [fromAccount]);
    }
}

export default SolTokenHelper;