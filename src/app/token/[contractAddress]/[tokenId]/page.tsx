import { getZoraTokens } from '@/lib/zora';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NFTCard } from '@/components/NFTCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
    params: Promise<{
        contractAddress: string;
        tokenId: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { contractAddress, tokenId } = await params;
    const tokens = await getZoraTokens();

    const tokenNode = tokens.find((t: { token: { collectionAddress: string, tokenId: string, name: string, description: string, image?: { url: string } } }) =>
        t.token.collectionAddress === contractAddress && t.token.tokenId === tokenId
    );

    if (!tokenNode) {
        return { title: 'Token Not Found | Earth Pulse' };
    }

    const { name, description, image } = tokenNode.token;
    const title = `${name} | Earth Pulse ReFi Asset`;

    return {
        title,
        description: description || 'Decentralized ecological satellite intelligence on Zora Network.',
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image?.url || 'https://via.placeholder.com/1200x630',
                    width: 1200,
                    height: 630,
                    alt: name,
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image?.url || 'https://via.placeholder.com/1200x630'],
        },
    };
}

export default async function TokenPage({ params }: Props) {
    const { contractAddress, tokenId } = await params;
    const tokens = await getZoraTokens();

    const tokenNode = tokens.find((t: { token: { collectionAddress: string, tokenId: string, name: string, description: string, image?: { url: string } } }) =>
        t.token.collectionAddress === contractAddress && t.token.tokenId === tokenId
    );

    if (!tokenNode) {
        notFound();
    }

    const token = tokenNode.token;

    return (
        <main className="min-h-screen bg-black text-zinc-100 p-8 pt-12 md:p-24 selection:bg-green-500/30 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-mono text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Feed
                </Link>

                <div className="max-w-md mx-auto">
                    <NFTCard token={token} />
                </div>
            </div>

            {/* Structured data for this specific artwork */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'VisualArtwork',
                        name: token.name,
                        image: token.image?.url,
                        description: token.description,
                        creator: {
                            '@type': 'Organization',
                            name: 'Earth Pulse',
                        },
                    }),
                }}
            />
        </main>
    );
}

export const revalidate = 60;
