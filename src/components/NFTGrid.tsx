import React from 'react';
import { NFTCard } from './NFTCard';

interface NFTGridProps {
    tokens: { token: { collectionAddress: string; tokenId: string; name: string; description: string; image?: { url: string } } }[];
}

export const NFTGrid: React.FC<NFTGridProps> = ({ tokens }) => {
    if (!tokens || tokens.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-500 font-mono">
                No satellite data signals detected.
            </div>
        );
    }

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {tokens.map((tokenNode, index) => (
                <div key={`${tokenNode.token.collectionAddress}-${tokenNode.token.tokenId}-${index}`} className="break-inside-avoid">
                    <NFTCard token={tokenNode.token} />
                </div>
            ))}
        </div>
    );
}
