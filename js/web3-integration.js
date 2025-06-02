/**
 * Web3 Integration for Santos Gutierrez Figueroa
 * Polygon Network Integration with NFT Access Control
 */

// Web3 Configuration
const POLYGON_MAINNET = {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
};

const POLYGON_MUMBAI = {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai Testnet',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
};

// NFT Contract Configuration (example values - replace with actual contract)
const NFT_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
const NFT_CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Global variables
let web3;
let userAccount;
let nftContract;
let isConnected = false;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const accessNFTBtn = document.getElementById('accessNFT');
const mintNFTBtn = document.getElementById('mintNFT');

// Initialize Web3
async function initWeb3() {
    // Check if Web3 is injected by MetaMask or similar
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Get connected account
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            
            // Check if we're on the correct network
            await checkAndSwitchNetwork();
            
            // Initialize NFT contract
            nftContract = new web3.eth.Contract(NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS);
            
            // Update UI
            updateUI(true);
            
            // Check for NFT ownership
            checkNFTOwnership();
            
            // Setup event listeners for account and chain changes
            setupEventListeners();
            
            return true;
        } catch (error) {
            console.error('Error initializing Web3:', error);
            showNotification('Error connecting wallet. Please try again.', 'error');
            return false;
        }
    } else if (window.web3) {
        // Legacy dapp browsers
        web3 = new Web3(window.web3.currentProvider);
        return true;
    } else {
        showNotification('No Ethereum wallet detected. Please install MetaMask or another wallet provider.', 'error');
        return false;
    }
}

// Check and switch to Polygon network if needed
async function checkAndSwitchNetwork() {
    try {
        const chainId = await web3.eth.getChainId();
        const targetChainId = parseInt(POLYGON_MAINNET.chainId, 16);
        
        if (chainId !== targetChainId) {
            try {
                // Try to switch to Polygon
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: POLYGON_MAINNET.chainId }]
                });
            } catch (switchError) {
                // If the network is not added, add it
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [POLYGON_MAINNET]
                        });
                    } catch (addError) {
                        console.error('Error adding Polygon network:', addError);
                        showNotification('Error adding Polygon network. Please add it manually in your wallet.', 'error');
                    }
                } else {
                    console.error('Error switching to Polygon network:', switchError);
                    showNotification('Error switching to Polygon network. Please switch manually in your wallet.', 'error');
                }
            }
        }
    } catch (error) {
        console.error('Error checking network:', error);
    }
}

// Check if user owns any NFTs
async function checkNFTOwnership() {
    try {
        if (!nftContract || !userAccount) return;
        
        const balance = await nftContract.methods.balanceOf(userAccount).call();
        
        if (parseInt(balance) > 0) {
            // User owns at least one NFT
            accessNFTBtn.classList.remove('disabled');
            accessNFTBtn.addEventListener('click', accessPrivateArea);
            
            // Get the first token ID owned by the user
            const tokenId = await nftContract.methods.tokenOfOwnerByIndex(userAccount, 0).call();
            console.log(`User owns NFT with token ID: ${tokenId}`);
            
            showNotification('NFT detected! You can now access the private area.', 'success');
        } else {
            // User doesn't own any NFTs
            accessNFTBtn.classList.add('disabled');
            showNotification('No NFTs detected. Get an NFT to access the private area.', 'info');
        }
    } catch (error) {
        console.error('Error checking NFT ownership:', error);
    }
}

// Access private area
function accessPrivateArea() {
    // Redirect to private area or show modal
    window.location.href = 'area-privada.html';
}

// Update UI based on connection status
function updateUI(connected) {
    isConnected = connected;
    
    if (connected && userAccount) {
        // Update connect wallet button
        connectWalletBtn.innerHTML = `<i class="fas fa-wallet me-1"></i> ${shortenAddress(userAccount)}`;
        connectWalletBtn.classList.add('connected');
        
        // Enable mint NFT button
        mintNFTBtn.classList.remove('disabled');
    } else {
        // Reset connect wallet button
        connectWalletBtn.innerHTML = '<i class="fas fa-wallet me-1"></i> Conectar Wallet';
        connectWalletBtn.classList.remove('connected');
        
        // Disable NFT-related buttons
        accessNFTBtn.classList.add('disabled');
        mintNFTBtn.classList.add('disabled');
    }
}

// Setup event listeners for wallet changes
function setupEventListeners() {
    if (window.ethereum) {
        // Handle account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                // User disconnected wallet
                userAccount = null;
                updateUI(false);
                showNotification('Wallet disconnected.', 'info');
            } else {
                // User switched accounts
                userAccount = accounts[0];
                updateUI(true);
                checkNFTOwnership();
                showNotification(`Wallet connected: ${shortenAddress(userAccount)}`, 'success');
            }
        });
        
        // Handle chain changes
        window.ethereum.on('chainChanged', (chainId) => {
            // Reload the page on chain change
            window.location.reload();
        });
    }
}

// Helper function to shorten address for display
function shortenAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Show notification to user
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `web3-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Handle mint NFT button click
function handleMintNFT() {
    // For demo purposes, redirect to a marketplace or minting page
    window.open('https://opensea.io/', '_blank');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', async () => {
            if (!isConnected) {
                await initWeb3();
            }
        });
    }
    
    if (mintNFTBtn) {
        mintNFTBtn.addEventListener('click', handleMintNFT);
    }
    
    // Add styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        .web3-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 350px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 9999;
        }
        
        .web3-notification.show {
            transform: translateX(0);
        }
        
        .web3-notification .notification-content {
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .web3-notification.success {
            border-left: 4px solid #28a745;
        }
        
        .web3-notification.error {
            border-left: 4px solid #dc3545;
        }
        
        .web3-notification.info {
            border-left: 4px solid #17a2b8;
        }
        
        .web3-notification .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);
});
