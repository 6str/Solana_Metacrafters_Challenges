// a public key BCN87ocRNukuqV9Jb7hwxbxiLNc7kRTbF5k4jh3BahHy

// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

const newKeyPair = Keypair.generate()
console.log(newKeyPair)