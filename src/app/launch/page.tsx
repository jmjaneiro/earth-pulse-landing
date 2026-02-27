"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download, Rocket } from "lucide-react";

export default function LaunchControlView() {
    const [xText, setXText] = useState("AI Generated text for X (Twitter). This is the hook.\n\nThread 2: CTA link check out the gallery.");
    const [farcasterText, setFarcasterText] = useState("AI Generated text for Farcaster Cast. /refi pulse.");
    const [zoraUrl, setZoraUrl] = useState("");
    const [isCasting] = useState(false);

    const mediaUrl = "/placeholder-media.png"; // Placeholder for satellite media

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(xText);
            alert("X Thread copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleDownloadMedia = () => {
        const link = document.createElement("a");
        link.href = mediaUrl;
        link.download = "satellite-media.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCastToFarcaster = () => {
        if (!zoraUrl) {
            alert("Zora Mint URL is required for the Farcaster Frame.");
            return;
        }
        const encodedText = encodeURIComponent(farcasterText);
        const encodedUrl = encodeURIComponent(zoraUrl);
        const intentUrl = `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedUrl}`;
        window.open(intentUrl, "_blank", "noopener,noreferrer");
    };

    const handlePostToX = () => {
        const encodedText = encodeURIComponent(xText);
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        window.open(intentUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Launch Control Center</h1>
                <p className="text-muted-foreground text-sm">Review, Edit, and Publish your Earth Pulse</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: X Flow */}
                <Card>
                    <CardHeader>
                        <CardTitle>X (Twitter) Flow</CardTitle>
                        <CardDescription>Review the thread text, download the media, and post directly to X.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="x-text">X Thread Text</Label>
                            <Textarea
                                id="x-text"
                                value={xText}
                                onChange={(e) => setXText(e.target.value)}
                                rows={8}
                                className="resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Media Preview</Label>
                            <div className="bg-muted rounded-md h-40 flex items-center justify-center overflow-hidden relative">
                                <p className="text-muted-foreground absolute z-10 font-mono text-xs">Satellite Feed Preview</p>
                                <div className="w-full h-full bg-gradient-to-br from-green-900/50 to-blue-900/50"></div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <div className="flex gap-2 w-full">
                            <Button onClick={handleCopyToClipboard} className="flex-1" variant="outline">
                                <Copy className="mr-2 h-4 w-4" /> Copy Text
                            </Button>
                            <Button onClick={handleDownloadMedia} className="flex-1" variant="outline">
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                        </div>
                        <Button onClick={handlePostToX} className="w-full">
                            Post to X
                        </Button>
                    </CardFooter>
                </Card>

                {/* Right Column: Farcaster Auto-Publisher */}
                <Card>
                    <CardHeader>
                        <CardTitle>Farcaster Flow</CardTitle>
                        <CardDescription>Review text and add the Zora Mint URL to cast directly with an embedded frame via Web Intent.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fc-text">Farcaster Cast Text</Label>
                            <Textarea
                                id="fc-text"
                                value={farcasterText}
                                onChange={(e) => setFarcasterText(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                        <div className="space-y-2 pt-4">
                            <Label htmlFor="zora-url">Zora Mint URL (Required for Frame)</Label>
                            <Input
                                id="zora-url"
                                placeholder="https://zora.co/collect/base:0x..."
                                value={zoraUrl}
                                onChange={(e) => setZoraUrl(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleCastToFarcaster}
                            className="w-full"
                            disabled={!zoraUrl}
                        >
                            <Rocket className="mr-2 h-4 w-4" />
                            Launch Farcaster
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
