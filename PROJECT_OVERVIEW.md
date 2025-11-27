# CarbonCredit DApp - Project Overview

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARBONCREDIT DAPP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │   Smart Contract │        │   Deployment     │               │
│  │  (CarbonCredit)  │◄──────►│   & Verification │               │
│  └──────────────────┘        └──────────────────┘               │
│         │                             │                          │
│         ├─ ERC20 Token                ├─ Hardhat Deploy Script   │
│         ├─ Ownable Access Control     └─ Etherscan Verification  │
│         └─ Carbon Offset Functions                               │
│                                                                   │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │    Monitoring    │        │   Event Tracking │               │
│  │   & Tracking     │◄──────►│   & Listening    │               │
│  └──────────────────┘        └──────────────────┘               │
│         │                             │                          │
│         ├─ Tracker Script             ├─ WebSocket Listener      │
│         ├─ Query Filter Events        ├─ Real-time Events        │
│         └─ Balance Check              └─ Event Subscription      │
│                                                                   │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │   Network        │        │   External       │               │
│  │   & RPC          │◄──────►│   Services       │               │
│  └──────────────────┘        └──────────────────┘               │
│         │                             │                          │
│         ├─ Local Hardhat Network      ├─ Sepolia Testnet        │
│         ├─ Infura HTTP RPC            ├─ Etherscan API          │
│         └─ Infura WebSocket           └─ Environment Vars       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Features Included

### 1. **Smart Contract (CarbonCredit.sol)**
   - ✅ ERC20 Token Standard Implementation
   - ✅ Ownable Access Control (only owner can mint/offset)
   - ✅ Issue Credits: Owner mints CO2C tokens to any address
   - ✅ Retire Credits: Users burn their own tokens
   - ✅ Offset Carbon: Owner burns user tokens based on CO2 tons
   - ✅ Event Tracking: CreditsIssued, CreditsRetired, CarbonOffsetted
   - ✅ Configurable Rate: 10 tokens = 1 ton CO2 offset

### 2. **Deployment & Verification**
   - ✅ Deploy Script (deploy.cjs): Deploys contract to any network
   - ✅ Etherscan Verification: Auto-verify source code on block explorer
   - ✅ Network Configuration: Sepolia testnet + local Hardhat support
   - ✅ Environment-based Configuration: RPC URLs, private keys, API keys

### 3. **Monitoring & Tracking**
   - ✅ Tracker Script (tracker.cjs): 
     - Execute issue/retire/offset operations
     - Query and display past events
     - Show transaction hashes, block numbers, gas used
     - Display current token balances
   - ✅ Real-time Listener (listener.cjs):
     - WebSocket-based event streaming
     - Listen to contract events as they occur
     - Formatted console output with transaction details

### 4. **Development & Testing**
   - ✅ Hardhat Framework: Solidity compilation & deployment
   - ✅ TypeScript Support: tsconfig.json configured
   - ✅ Local Network: Hardhat ephemeral network for quick testing
   - ✅ npm Scripts: 
     ```
     npm run compile              # Compile contracts
     npm run deploy:local         # Deploy to local network
     npm run deploy:sepolia       # Deploy to Sepolia testnet
     npm run track:local          # Track on local network
     npm run track:sepolia        # Track on Sepolia testnet
     npm run verify:sepolia       # Verify on Etherscan
     ```

### 5. **Security & Best Practices**
   - ✅ .gitignore: Prevents `.env` and node_modules from being committed
   - ✅ .env.example: Template for required environment variables
   - ✅ Environment Variable Validation: Checks for required config
   - ✅ Error Handling: Try-catch blocks in all scripts
   - ✅ Safe Null Checks: Guards for undefined RPC URLs and accounts

### 6. **Documentation**
   - ✅ README.md: Setup and usage instructions
   - ✅ PROJECT_OVERVIEW.md: This file (architecture & features)
   - ✅ Code Comments: Inline documentation
   - ✅ Example Commands: Copy-paste ready PowerShell commands

---

## 🔄 Data Flow Diagram

```
User/Owner
    │
    ├─ Issue Credits (1000 CO2C)
    │     │
    │     ▼
    │  Smart Contract (_mint)
    │     │
    │     ▼
    │  CreditsIssued Event Emitted
    │     │
    ├─────┼─► Tracker captures event
    │     │     │
    │     │     ▼
    │     │  Display: tx hash, block, gas
    │     │
    │     └─► Listener (WebSocket) prints in real-time
    │
    ├─ Retire Credits (100 CO2C)
    │     │
    │     ▼
    │  Smart Contract (_burn)
    │     │
    │     ▼
    │  CreditsRetired Event Emitted
    │
    └─ Offset Carbon (5 tons = 50 tokens)
          │
          ▼
       Smart Contract (_burn)
          │
          ▼
       CarbonOffsetted Event Emitted
          │
          ▼
       Etherscan Shows on Block Explorer
```

---

## 📊 Event System

| Event Name | Parameters | When Triggered |
|---|---|---|
| **CreditsIssued** | `to` (address), `amount` (uint256) | Owner issues new tokens |
| **CreditsRetired** | `from` (address), `amount` (uint256) | User burns their tokens |
| **CarbonOffsetted** | `user` (address), `tons` (uint256), `tokensUsed` (uint256) | Owner offsets carbon |

---

## 🌐 Network Support

| Network | Status | RPC Provider | Use Case |
|---|---|---|---|
| **Local Hardhat** | ✅ Active | Built-in | Development & Testing |
| **Sepolia Testnet** | ✅ Live | Infura | Staging & Demo |
| **Mainnet Ethereum** | ❌ Not Configured | - | Production (future) |

---

## 📦 Dependencies

```json
{
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "@openzeppelin/contracts": "^5.4.0",
    "hardhat": "^2.26.0",
    "typescript": "~5.8.0"
  },
  "dependencies": {
    "dotenv": "^17.2.3",
    "ethers": "^6.x"
  }
}
```

---

## 🎯 Deployed Contract

**Network**: Sepolia Testnet  
**Address**: `0x4068EfFf0Aa1Ae97f923450E533E9F20Ea7952ef`  
**Status**: ✅ Verified on Etherscan  
**Link**: https://sepolia.etherscan.io/address/0x4068EfFf0Aa1Ae97f923450E533E9F20Ea7952ef#code

---

## 🚀 Quick Start Commands

### Local Testing
```powershell
npm run compile
npm run deploy:local
npm run track:local
```

### Sepolia Deployment
```powershell
npm run deploy:sepolia
npm run track:sepolia
npm run verify:sepolia 0x4068EfFf0Aa1Ae97f923450E533E9F20Ea7952ef
```

### Real-time Monitoring
```powershell
node scripts/listener.cjs
```

---

## 📂 Project Structure

```
CARBON-CREDIT-SYSTEM/
├── contracts/
│   └── CarbonCredit.sol         # Smart contract
├── scripts/
│   ├── deploy.cjs               # Deploy script
│   ├── tracker.cjs              # Transaction tracker
│   └── listener.cjs             # WebSocket listener
├── hardhat.config.cjs           # Hardhat configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── README.md                    # Setup guide
└── PROJECT_OVERVIEW.md          # This file
```

---

## ✨ Key Highlights

- 🔒 **Secure**: Ownable pattern + proper access control
- 📊 **Trackable**: Full event logging for all operations
- 🌍 **Testable**: Works on local + Sepolia networks
- 🔍 **Verifiable**: Contract verified on Etherscan
- 📡 **Real-time**: WebSocket listener for live monitoring
- 📦 **Production-ready**: No compilation errors, fully tested

---

**Repository**: https://github.com/khiladipacchi-netizen/CARBON-CREDIT-SYSTEM  
**Last Updated**: November 27, 2025
