import { createPublicClient, http, parseAbi } from 'viem';
import { base, mainnet, zora } from 'viem/chains';

// Setup Viem Client
const getClient = (networkName: string) => {
    const chain = networkName === 'zora' ? zora : networkName === 'mainnet' ? mainnet : base;
    return createPublicClient({
        chain,
        transport: http()
    });
};

const ZORA_1155_ABI = parseAbi([
    'function name() view returns (string)',
    'function uri(uint256 tokenId) view returns (string)',
    'function tokenURI(uint256 tokenId) view returns (string)'
]);

export const getZoraTokens = async () => {
    // Check if we should use mock data exclusively
    if (process.env.MOCK_ZORA_API === 'true') {
        return getMockTokens().slice(0, 6);
    }

    const contractAddress = (process.env.NEXT_PUBLIC_ZORA_CONTRACT_ADDRESS || '') as `0x${string}`;
    const network = process.env.NEXT_PUBLIC_NETWORK || 'base';

    if (!contractAddress || contractAddress.length !== 42) {
        console.log('Invalid Zora Contract Address, returning mock data.');
        return getMockTokens().slice(0, 6);
    }

    const client = getClient(network);
    const tokens = [];

    try {
        // We will optimistically try to fetch token IDs 1 through 6
        for (let i = BigInt(1); i <= BigInt(6); i++) {
            let uriRaw = '';
            try {
                // Try ERC1155 uri() first
                uriRaw = await client.readContract({
                    address: contractAddress,
                    abi: ZORA_1155_ABI,
                    functionName: 'uri',
                    args: [i]
                });
            } catch (e) {
                try {
                    // Try ERC721 tokenURI() fallback
                    uriRaw = await client.readContract({
                        address: contractAddress,
                        abi: ZORA_1155_ABI,
                        functionName: 'tokenURI',
                        args: [i]
                    });
                } catch (err) {
                    // Reverted, likely token doesn't exist. Stop iterating.
                    break;
                }
            }

            if (!uriRaw) break;

            // Fetch IPFS Metadata
            const httpUri = uriRaw.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
            try {
                const metadata = await fetch(httpUri).then(r => r.json());
                tokens.push({
                    token: {
                        collectionAddress: contractAddress,
                        tokenId: i.toString(),
                        name: metadata.name || `Token ${i}`,
                        description: metadata.description || '',
                        image: {
                            url: metadata.image ? metadata.image.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/') : ''
                        }
                    }
                });
            } catch (metadataErr) {
                console.error(`Failed to fetch IPFS metadata for token ${i}`);
            }
        }

        if (tokens.length === 0) {
            console.log('No Zora tokens found on-chain, returning mock data fallback.');
            return getMockTokens().slice(0, 6);
        }

        return tokens.reverse(); // Newest first

    } catch (error) {
        console.error('Error fetching Zora tokens via viem, returning mock data fallback:', error);
        return getMockTokens().slice(0, 6);
    }
};

const getMockTokens = () => {
    return Array.from({ length: 6 }).map((_, i) => ({
        token: {
            collectionAddress: '0x1234567890abcdef',
            tokenId: `${i + 1}`,
            name: `Earth Pulse Region ${i + 1}`,
            description: `High-resolution ReFi satellite imagery of region ${i + 1}, capturing vital ecological data.📍 Location: Amazon Rainforest sector ${i + 1}`,
            image: {
                // Return a placeholder image tailored to satellite ReFi aesthetic
                url: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800`
            }
        }
    }));
};
