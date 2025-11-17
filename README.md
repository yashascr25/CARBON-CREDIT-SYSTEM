# CarbonCredit DApp

This repository contains a simple ERC20-based Carbon Credit contract and scripts to deploy and track it.

## Files

- `contracts/CarbonCredit.sol` - ERC20 token with owner minting and burn/offset features. Emits events for tracking.
- `hardhat.config.cjs` - Hardhat configuration (solidity version, network settings). Etherscan API key support added.
- `scripts/deploy.cjs` - Deploys the `CarbonCredit` contract.
- `scripts/tracker.cjs` - Deploys (or attaches to) the contract and exercises functions, printing transactions and events.
- `.env.example` - Example environment variables. Copy to `.env` and fill in your keys.

## Quick Start

1. Install dependencies

```powershell
cd "c:\Users\tejas\Downloads\Block chain"
npm install
```

2. Create `.env` from `.env.example` and fill values. Make sure `PRIVATE_KEY` includes the `0x` prefix.

3. Compile

```powershell
npm run compile
```

4. Run locally (no funds needed)

```powershell
npm run deploy:local
npm run track:local
```

5. Deploy to Sepolia (requires funded account and `SEPOLIA_RPC_URL`)

```powershell
# After funding the wallet on a Sepolia faucet
npm run deploy:sepolia
# Then (optional) verify; replace <address> with the printed contract address
npm run verify:sepolia -- <CONTRACT_ADDRESS>
```

6. To track an already-deployed contract, set `CONTRACT_ADDRESS` in `.env` and run:

```powershell
npm run track:sepolia
```

## Real-time event listener

If you want a long-running process that streams events as they happen, use the WebSocket listener.

1. Add a WebSocket RPC URL to your `.env` (preferred) or ensure `SEPOLIA_RPC_URL` is present. Example in `.env.example`:

```text
SEPOLIA_WS_URL=wss://sepolia.infura.io/ws/v3/YOUR_INFURA_KEY
```

2. Ensure `CONTRACT_ADDRESS` is set in `.env`.

3. Run the listener:

```powershell
node scripts/listener.cjs
```

The listener will print each `CreditsIssued`, `CreditsRetired`, and `CarbonOffsetted` event in real time.

## Notes

- Keep `.env` private; do not commit it.
- If you ever accidentally commit secrets, rotate keys immediately.

