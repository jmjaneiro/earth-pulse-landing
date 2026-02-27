import React from 'react';
import Link from 'next/link';
import { Card, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Twitter, Hexagon } from 'lucide-react'; // Using Hexagon as a Farcaster/Warpcast placeholder if appropriate, or generic share

interface NFTCardProps {
    token: { name: string; description: string; image?: { url: string }; collectionAddress: string; tokenId: string;[key: string]: unknown };
}

export const NFTCard: React.FC<NFTCardProps> = ({ token }) => {
    const { name, description, image, collectionAddress, tokenId } = token;
    const referralAddress = process.env.NEXT_PUBLIC_ZORA_REFERRAL_ADDRESS || '0x0000000000000000000000000000000000000000';
    const mintUrl = `https://zora.co/collect/zora:${collectionAddress}/${tokenId}?referrer=${referralAddress}`;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'https://earthpulse.xyz';
    const postUrl = `${baseUrl}/token/${collectionAddress}/${tokenId}`;
    const encodedTitle = encodeURIComponent(name);
    const encodedUrl = encodeURIComponent(postUrl);

    const xShareUrl = `https://twitter.com/intent/tweet?text=Archiving Earth's Pulse onchain. View the latest satellite data from ${encodedTitle}: ${encodedUrl}`;
    const warpcastShareUrl = `https://warpcast.com/~/compose?text=Archiving Earth's Pulse onchain. View the latest satellite data from ${encodedTitle}&embeds[]=${encodedUrl}`;

    return (
        <Card className="group overflow-hidden bg-black/40 border-zinc-900 hover:border-zinc-700 transition-all duration-500 backdrop-blur-sm rounded-xl">
            <div className="relative w-full overflow-hidden bg-zinc-900 border-b border-zinc-900">
                {/* Minimal masonry image mapping */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image?.url || 'https://via.placeholder.com/400?text=No+Image'}
                    alt={name}
                    className="object-cover w-full h-auto max-h-[600px] transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                />
            </div>

            <CardHeader className="p-5 space-y-2">
                <Link href={`/token/${collectionAddress}/${tokenId}`}>
                    <h3 className="font-semibold text-lg text-zinc-200 hover:text-white transition-colors">
                        {name}
                    </h3>
                </Link>
                <p className="text-sm text-zinc-500 font-sans line-clamp-3 font-light">
                    {description}
                </p>
            </CardHeader>

            <CardFooter className="p-5 pt-0 flex flex-col gap-3">
                <Button asChild className="w-full bg-zinc-100 text-black hover:bg-green-500 hover:text-black transition-colors font-medium tracking-tight rounded-lg">
                    <a href={mintUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        Mint on Zora <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                </Button>

                <div className="flex w-full gap-2">
                    <Button asChild variant="outline" className="flex-1 bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors rounded-lg">
                        <a href={xShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            <Twitter className="w-4 h-4" />
                            <span className="text-xs">Share</span>
                        </a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors rounded-lg">
                        <a href={warpcastShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            <Hexagon className="w-4 h-4" />
                            <span className="text-xs">Cast</span>
                        </a>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
