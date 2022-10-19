import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  PublicKey,
  Transaction
} from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { disconnect } from 'process';

type DisplayEncoding = 'utf8' | 'hex';

type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';
type PhantomRequestMethod = 
| 'connect'
| 'disconnect'
| 'signTransaction'
| 'signAllTransactions'
| 'signMessage';

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

const getProvider = (): PhantomProvider | undefined => {
  if ('solana' in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};

function App() {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );

  const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
    undefined
  );

  const [pubKey, setPubKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    const provider = getProvider();

    if(provider) setProvider(provider);
    else setProvider(undefined);
  });

  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response =  await solana.connect(); // returns a publicKey object
        console.log('wallet account ', response.publicKey.toString());
        setWalletKey(response); // response is a publicKey object
        setPubKey(response.publicKey.toString().slice(0, 5) + ' ... ' + response.publicKey.toString().slice(-5));
        console.log(pubKey);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;
    if (walletKey && solana) {
      await (solana as PhantomProvider).disconnect();
      setWalletKey(undefined);
      console.log("disconnected wallet");
    }
  };


  const disconnectButton = () => {
    return (
      <button
      style={{
        fontSize: '16px',
        padding: '15px',
        fontWeight: 'bold',
        borderRadius: '5px',
      }}
      onClick={disconnectWallet}
      >
        Disconnect Wallet
      </button>
    )
  }


  return (
    <div className="App">
      <div className="topBar">
        {provider && walletKey && disconnectButton()}
      </div>
      <header className="App-header">
        <h2>Connect to Phantom Wallet</h2>
        {(provider && !walletKey) && (
          <button
            style={{
              fontSize: '16px',
              padding: '15px',
              fontWeight: 'bold',
              borderRadius: '5px',
            }}
            onClick={connectWallet}
          >
              Connect Wallet
          </button>
        )}
        
        {provider && walletKey && <p> Connected account: {pubKey}</p>}
        {/* {provider && walletKey && <p> Connected account: {walletKey.publicKey.toString()}</p>} */}
        {!provider && (
          <p>
            No provider found. Install{' '}
            <a href='https://phantom.app/'>Phantom Browser extension</a>
          </p>
        )}

      </header>
    </div>
  );
}

export default App;
