"use client";

import { useEffect, useState } from 'react';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export default function Home() {
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  // Move connection inside or wrap in a check for SSR safety
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4E44CE',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    marginRight: '10px',
    boxShadow: '0 4px 12px rgba(78, 68, 206, 0.3)',
    transition: 'all 0.2s ease',
  };

  useEffect(() => {
    // Check if running in browser and if solana exists
    const solana = typeof window !== 'undefined' ? (window as any).solana : null;

    if (solana?.isPhantom) {
      setWalletInstalled(true);
      solana.on?.('connect', () => {
        setConnected(true);
        setPublicKey(solana.publicKey?.toString());
      });
      solana.on?.('disconnect', () => {
        setConnected(false);
        setPublicKey(null);
        setBalance(null);
      });
    }
  }, []);

  async function connectWallet() {
    const solana = (window as any).solana;
    try {
      setStatus('Connecting...');
      const resp = await solana.connect();
      setPublicKey(resp.publicKey.toString());
      setConnected(true);
      setStatus('Connected');
      await fetchBalance(resp.publicKey.toString());
    } catch (e: any) {
      setStatus('Connection failed: ' + e.message);
    }
  }

  async function disconnectWallet() {
    const solana = (window as any).solana;
    try {
      await solana.disconnect();
      setConnected(false);
      setPublicKey(null);
      setBalance(null);
      setStatus('Disconnected');
    } catch (e) {
      setStatus('Disconnect failed');
    }
  }

  async function fetchBalance(pubKeyStr: string) {
    try {
      setStatus('Fetching balance...');
      const pk = new PublicKey(pubKeyStr);
      const bal = await connection.getBalance(pk);
      setBalance(bal / LAMPORTS_PER_SOL);
      setStatus('Balance fetched');
    } catch (e) {
      setStatus('Balance fetch error');
    }
  }

  async function requestAirdrop() {
    try {
      setStatus('Requesting airdrop...');
      if (!publicKey) { setStatus('Connect wallet first'); return; }
      const pk = new PublicKey(publicKey);
      const sig = await connection.requestAirdrop(pk, 1 * LAMPORTS_PER_SOL); 
      await connection.confirmTransaction(sig, 'confirmed');
      await fetchBalance(publicKey);
      setStatus('Airdrop received (devnet)');
    } catch (e: any) {
      setStatus('Airdrop failed: ' + (e.message || e));
    }
  }

  return (
    <div style={{maxWidth:900, margin:'30px auto', padding:20, fontFamily:'sans-serif', color: '#333'}}>
      <h1>Solana Wallet Connect Demo</h1>
      <p style={{color:'#666', marginBottom: '30px'}}>Manage your devnet SOL safely.</p>

      <div style={{padding:24, backgroundColor: '#f9f9f9', border:'1px solid #eee', borderRadius:16}}>
        <p><strong>Wallet:</strong> {walletInstalled ? '✅ Phantom Installed' : '❌ Install Phantom'}</p>
        <p><strong>Status:</strong> <span style={{color: '#4E44CE'}}>{status || 'Idle'}</span></p>

        {!walletInstalled ? (
          <p>Get the extension: <a href="https://phantom.app" target="_blank" rel="noreferrer" style={{color: '#4E44CE'}}>phantom.app</a></p>
        ) : (
          <div style={{marginTop: 20}}>
            {!connected ? (
              <button onClick={connectWallet} style={buttonStyle}>Connect Phantom</button>
            ) : (
              <button onClick={disconnectWallet} style={{...buttonStyle, backgroundColor: '#333'}}>Disconnect</button>
            )}

            <button onClick={requestAirdrop} style={buttonStyle}>Request 1 SOL Airdrop</button>

            <div style={{marginTop:24, padding: 15, backgroundColor: '#fff', borderRadius: 12, border: '1px solid #eee'}}>
              <p style={{fontSize: '14px', margin: '5px 0'}}><strong>Public Key:</strong> <code style={{fontSize: '12px'}}>{publicKey || 'Not connected'}</code></p>
              <p style={{fontSize: '14px', margin: '5px 0'}}><strong>Balance:</strong> {balance === null ? '0.00' : balance} SOL</p>
            </div>
          </div>
        )}
      </div>

      <div style={{marginTop:30, backgroundColor: '#fff4f4', padding: '15px', borderRadius: '12px', border: '1px solid #ffcccc'}}>
        <p style={{margin: 0, fontWeight: 'bold', color: '#d32f2f'}}>⚠️ Security Notes:</p>
        <ul style={{color: '#d32f2f', fontSize: '14px', marginTop: '10px'}}>
          <li>This uses <strong>devnet</strong> only. Do not send real money.</li>
          <li>Keep your seed phrase private. Never share it with anyone.</li>
        </ul>
      </div>
    </div>
  );
}


