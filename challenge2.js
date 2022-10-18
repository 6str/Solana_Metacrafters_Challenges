// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

var from, to

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        160,  20, 189, 212, 129, 188, 171, 124,  20, 179,  80,
         27, 166,  17, 179, 198, 234,  36, 113,  87,   0,  46,
        186, 250, 152, 137, 244,  15,  86, 127,  77,  97, 170,
         44,  57, 126, 115, 253,  11,  60,  90,  36, 135, 177,
        185, 231,  46, 155,  62, 164, 128, 225, 101,  79,  69,
        101, 154,  24,  58, 214, 219, 238, 149,  86
      ]            
);

const userSecretKey = new Uint8Array(
    [
    252,  72, 156,  20,  85,   4,  62, 247, 104, 146,  66,
     49, 135, 151, 212,  77,  12, 112, 177,  29, 174, 250,
     24,  24, 123, 177,  59, 182, 127,  72, 181,  17, 120,
     82,  14,  27,  51,  44, 230,  50,  59, 246, 186, 100,
    140, 223, 120, 229, 157, 202, 255, 104,  35, 136, 101,
    218, 199, 186, 238,  41, 165, 255, 120,  60
  ]
);


// Get the wallet balance from a given private key
const getWalletBalance = async (pubKey) => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // console.log("Connection object is:", connection);

        const walletBalance = await connection.getBalance(
            new PublicKey(pubKey)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    // var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    // Other things to try: 
    // 1) Form array from userSecretKey
    from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
    // 2) Make a new Keypair (starts with 0 SOL)
    // const from = Keypair.generate();

    console.log("from wallet")
    await getWalletBalance(from.publicKey)

    // Generate another Keypair (account we'll be sending to)
    console.log("to wallet")
    to = Keypair.generate();
    await getWalletBalance(to.publicKey)

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("Airdrop completed for the Sender account");

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: LAMPORTS_PER_SOL / 100
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);
}

(async function() {
    await transferSol();

    console.log("from wallet")
    await getWalletBalance(from.publicKey)
    
    console.log("to wallet")
    await getWalletBalance(to.publicKey)
})()

