"use client"

import { useState } from "react";

export function CopyButton({ pollId }: { pollId: string }) {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.origin + "/poll/" + pollId);
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), 2000)
    }

    return <div>
        {isCopied ? (
            <p className="bg-green-500/20 mt-1 py-1 rounded-lg text-center font-semibold">Copied to clipboard</p>
        ) : (
            <button className="bg-white/10 w-full py-1 mt-2 rounded-lg hover:bg-green-500/40 font-semibold" onClick={handleCopy}>Copy</button>
        )}
    </div>
}