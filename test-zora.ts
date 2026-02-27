import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

async function test() {
    const client = createPublicClient({
        chain: base,
        transport: http()
    });

    const address = '0x1802c1d526a563471ed64a91045104dc7f1786fe' as const;
    const abi = parseAbi([
        'function uri(uint256 tokenId) view returns (string)',
        'function tokenURI(uint256 tokenId) view returns (string)'
    ]);

    for (let i = BigInt(1); i <= BigInt(10); i++) {
        try {
            const uriRaw = await client.readContract({
                address,
                abi,
                functionName: 'uri',
                args: [i]
            });
            console.log(`URI found via uri() for ID ${i}:`, uriRaw);
            break;
        } catch (e) {
            try {
                const uriRaw = await client.readContract({
                    address,
                    abi,
                    functionName: 'tokenURI',
                    args: [i]
                });
                console.log(`URI found via tokenURI() for ID ${i}:`, uriRaw);
                break;
            } catch (err) {
                // skip
            }
        }
    }
}
test();
