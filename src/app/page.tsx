import { getZoraTokens } from '@/lib/zora';
import { NFTGrid } from '@/components/NFTGrid';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tokens = await getZoraTokens();
  const latestToken = tokens[0]?.token;

  let title = 'Earth Pulse | Web3 ReFi Satellite Imagery';
  let description = 'Automated Earth Pulse Gallery syncing verified ecological satellite data as NFTs on Zora Network.';

  if (latestToken) {
    title = `Monitoring: ${latestToken.name} | Earth Pulse`;
    description = latestToken.description || description;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: latestToken?.image?.url || 'https://via.placeholder.com/1200x630?text=Earth+Pulse+ReFi',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [latestToken?.image?.url || 'https://via.placeholder.com/1200x630?text=Earth+Pulse+ReFi'],
    },
  };
}

export default async function Home() {
  const tokens = await getZoraTokens();
  const latestToken = tokens[0]?.token;

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-8 pt-12 md:p-24 selection:bg-green-500/30 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col items-center text-center space-y-8 py-12 lg:py-24 relative">


          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-950/30 border border-green-500/20 text-green-400 text-xs font-mono uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
            Monitoring Earth Systems
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-green-100 to-green-900 drop-shadow-sm">
            Earth Pulse
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl font-sans font-light leading-relaxed">
            Archiving planetary regeneration onchain.
          </p>
        </header>

        <section className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-6 font-mono text-sm text-zinc-400 overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-900 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
            <span className="ml-2 text-xs text-zinc-600 uppercase tracking-widest px-2 bg-zinc-900 rounded-sm">system_manifesto.log</span>
          </div>
          <div className="space-y-3 opacity-90">
            <p>
              <span className="text-green-500 mr-2">&gt;</span>
              The Earth is not static; it breathes, shifts, and regenerates.
            </p>
            <p>
              <span className="text-green-500 mr-2">&gt;</span>
              Earth Pulse is an autonomous data-art protocol capturing these planetary metamorphoses.
            </p>
            <p>
              <span className="text-green-500 mr-2">&gt;</span>
              By extracting raw satellite telemetry from the Copernicus program and immutably archiving it on the Base network, we create permanent onchain records of climate resilience.
            </p>
            <p className="pt-2 text-zinc-300 font-medium">
              <span className="text-green-400 mr-2 animate-pulse">_</span>
              You are not just collecting an image; you are archiving a timestamp of our planet&apos;s history.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-200 flex items-center gap-3">
            <span className="bg-green-500 w-2 h-6 inline-block"></span>
            Decentralized Data Feed
            <span className="text-sm font-normal text-zinc-500 font-mono tracking-widest ml-auto hidden sm:inline-block">LIVE_SYNC</span>
          </h2>
          <NFTGrid tokens={tokens} />
        </section>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DataCatalog',
            name: 'Earth Pulse ReFi Database',
            description: 'A growing decentralized catalog of high-resolution ReFi satellite imagery.',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://earthpulse.xyz',
          }),
        }}
      />
    </main>
  );
}

// Force dynamic rendering to always fetch latest API data if needed, or use revalidate.
export const revalidate = 60; // Revalidate every 60 seconds
