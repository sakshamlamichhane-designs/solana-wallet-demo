# CivicVoice — Solana Wallet Connect Demo (Pulchowk Mini-Hack)

*One-line:* A beginner-friendly Solana demo that lets users connect a Phantom wallet, view their public address and devnet SOL balance, and interact safely on Devnet.

## Live demo
https://solana-wallet-demo-nine.vercel.app/

## Repo
https://github.com/sakshamlamichhane-designs/solana-wallet-demo

## What this is
CivicVoice is a minimal, safe Web3 onboarding demo for students. The goal is to reduce the barrier to entry: connect a wallet, see your address and devnet balance, and test a devnet airdrop — no real money required. This demo is intentionally simple and educational.

## Problem statement
Many students find Web3 intimidating because they fear losing money, breaking contracts, or dealing with complex tooling. This demo solves the onboarding problem: it shows how to safely connect a wallet and interact with the Solana devnet so learners can experiment without risk.

## Impact & why it matters
- Lowers the barrier to entry for students and new developers.
- Creates shareable proof-of-competence (live demo + repo).
- Encourages building small, safe dApps before moving to production.

## Tech stack
- Frontend: Next.js (React)
- Solana SDK: @solana/web3.js
- Wallet: Phantom (Devnet)
- Deployment: Vercel

## Run locally (developer)
1. git clone https://github.com/sakshamlamichhane-designs/solana-wallet-demo.git
2. cd solana-wallet-connect-demo
3. npm install
4. npm run dev
5. Open http://localhost:3000 and enable Phantom Testnet Mode.

Note: This demo uses *Devnet* only. Do not send real money.

## How to demo (for judges)
1. Open the live demo: https://solana-wallet-demo-nine.vercel.app/  
2. Click *Connect Phantom* and approve the connection.  
3. (Optional) Use the Solana Devnet faucet to request 1 SOL for testing.  
4. The page will display your public key and devnet balance.

## Files & structure
- pages/index.js — demo UI & wallet logic
- README.md — this file

## License
MIT

## Contact
Saksham Lamichhane — sakshamlamichhane456@gmail.com
