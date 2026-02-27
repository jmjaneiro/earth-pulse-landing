import React from 'react';
import { Activity } from 'lucide-react';

interface LiveTrackerProps {
    latestToken: { description?: string;[key: string]: unknown } | null;
}

export const LiveTracker: React.FC<LiveTrackerProps> = ({ latestToken }) => {
    // Try to extract location from description, or fallback
    let location = "Global ReFi Network";
    if (latestToken?.description) {
        const match = latestToken.description.match(/📍 Location:\s*(.*)/i);
        if (match) location = match[1];
    }

    return (
        <div className="flex items-center justify-between p-4 mb-8 border border-green-500/30 bg-green-950/20 text-green-400 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-sm animate-pulse-slow">
            <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 animate-pulse text-green-500" />
                <span className="font-mono text-sm tracking-wider uppercase">Live Earth Pulse</span>
            </div>
            <div className="text-sm font-mono opacity-80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
                Monitoring: {location}
            </div>
        </div>
    );
}
