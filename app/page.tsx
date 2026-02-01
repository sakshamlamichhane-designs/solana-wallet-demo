"use client";

import { useEffect, useState } from 'react';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export default function Home() {
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('');

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Button styling
  const buttonStyle = {
    backgroundColor: '#4E44CE', // Phantom Purple
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
    if (typeof window !== 'undefined' && window?.solana?.isPhantom) {
      setWalletInstalled(true);
      window.solana.on && window.solana.on('connect', () => {
        setConnected(true);
        setPublicKey(window.solana.publicKey?.toString());
      });
      window.solana.on && window.solana.on('disconnect', () => {
        setConnected(false);
        setPublicKey(null);
        setBalance(null);
      });
    }
  }, []);

  async function connectWallet() {
    try {
      setStatus('Connecting...');
      const resp = await window.solana.connect();
      setPublicKey(resp.publicKey.toString());
      setConnected(true);
      setStatus('Connected');
      await fetchBalance(resp.publicKey);
    } catch (e) {
      setStatus('Connection failed: ' + e.message);
    }
  }

  async function disconnectWallet() {
    try {
      await window.solana.disconnect();
      setConnected(false);
      setPublicKey(null);
      setBalance(null);
      setStatus('Disconnected');
    } catch (e) {
      setStatus('Disconnect failed');
    }
  }

  async function fetchBalance(pubKey) {
    try {
      setStatus('Fetching balance...');
      const pk = typeof pubKey === 'string' ? new PublicKey(pubKey) : pubKey;
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
      await fetchBalance(pk);
      setStatus('Airdrop received (devnet)');
    } catch (e) {
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

