require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error('Please set CONTRACT_ADDRESS in .env to the deployed contract address.');
    process.exit(1);
  }

  const wsUrl = process.env.SEPOLIA_WS_URL || process.env.SEPOLIA_RPC_URL.replace(/^http/, 'ws');
  if (!wsUrl) {
    console.error('Please set SEPOLIA_WS_URL (or SEPOLIA_RPC_URL) in .env.');
    process.exit(1);
  }

  console.log('Connecting to', wsUrl);
  const provider = new ethers.WebSocketProvider(wsUrl);

  const abi = [
    'event CreditsIssued(address indexed to, uint256 amount)',
    'event CreditsRetired(address indexed from, uint256 amount)',
    'event CarbonOffsetted(address indexed user, uint256 tons, uint256 tokensUsed)'
  ];

  const contract = new ethers.Contract(contractAddress, abi, provider);

  console.log('Listening for events from', contractAddress);

  contract.on('CreditsIssued', (to, amount, event) => {
    console.log('[CreditsIssued] to=', to, 'amount=', ethers.formatUnits(amount, 18), 'tx=', event.transactionHash);
  });

  contract.on('CreditsRetired', (from, amount, event) => {
    console.log('[CreditsRetired] from=', from, 'amount=', ethers.formatUnits(amount, 18), 'tx=', event.transactionHash);
  });

  contract.on('CarbonOffsetted', (user, tons, tokensUsed, event) => {
    console.log('[CarbonOffsetted] user=', user, 'tons=', tons.toString(), 'tokensUsed=', ethers.formatUnits(tokensUsed, 18), 'tx=', event.transactionHash);
  });

  // In some provider implementations the underlying websocket may not be exposed
  // directly; guard access to avoid uncaught exceptions.
  const ws = provider._websocket;
  if (ws && typeof ws.on === 'function') {
    ws.on('close', (code) => {
      console.error('WebSocket closed with code', code, '- exiting');
      process.exit(1);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error', err);
    });
  } else {
    console.log('Underlying websocket not exposed; relying on provider events.');
    provider.on('network', (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        console.log('Network changed, exiting');
        process.exit(1);
      }
    });
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
