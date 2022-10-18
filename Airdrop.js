const fromAirDropSignature = await connection.requestAirdrop(
    new PublicKey(myWallet.publicKey),
    2 * LAMPORTS_PER_SOL
);
