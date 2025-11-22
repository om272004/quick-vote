"use client"

import Pusher from "pusher-js";
import { useEffect, useState } from "react"
import { getExpiryStatus } from "./Polls";

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
});

export function VoteModule({ poll }: any) {
    const [voteId, setVoteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ [optionId: string]: number }>({});
    const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);

    const totalVotes = poll.pollOption.reduce((acc : number, option : any) => {
        return acc + (results[option.id] || 0);
    }, 0);


    useEffect(() => {
        const storedVoteId = localStorage.getItem(`vote_poll_${poll.id}`);
        if (storedVoteId) {
            setVoteId(storedVoteId);
        }
    }, [poll.id]);

    useEffect(() => {
        fetch(`/api/polls/${poll.id}/results`)
            .then(res => res.json())
            .then((data: any[]) => {
                const initialResults = data.reduce((acc, option) => {
                    acc[option.id] = option._count.vote;
                    return acc;
                }, {});
                setResults(initialResults);
            });

        const channel = pusherClient.subscribe("poll-channel");

        channel.bind("new-vote", (data: { pollOptionId: string }) => {
            setResults(prevResults => {
                const currCount = prevResults[data.pollOptionId] || 0;
                return {
                    ...prevResults,
                    [data.pollOptionId]: currCount + 1,
                };
            });
        });

        return () => {
            pusherClient.unsubscribe("poll-channel");
        };

    }, [poll.id]);

    const submitVote = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pollOptionId: id })
            });

            if (response.ok) {
                localStorage.setItem(`vote_poll_${poll.id}`, id);
                setVoteId(id);
            } else {
                alert("Failed to submit vote.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    }

    const showResults = !!voteId || isExpired;

    return (
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto mt-4">
            {isExpired && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-center mb-4 font-bold">
                    This poll has ended
                </div>
            )}
            {poll.pollOption.map((option: any) => {
                const hasVoted = !!voteId;
                const isThisVoted = (voteId === option.id);
                
                const voteCount = results[option.id] || 0;
                const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);

                return (
                    <button
                        key={option.id}
                        onClick={() => submitVote(option.id)}
                        disabled={loading || hasVoted || isExpired}
                        className={`
                            relative p-4 rounded-lg border text-left transition-all overflow-hidden group bg-white/10 backdrop-blur-lg border-white/20
                            ${hasVoted || isExpired ? 'cursor-default' : 'hover:border-green-400/30'}
                            ${isThisVoted ? 'border-green-500 ring-1 ring-green-500' : 'border-red-600'}
                        `}
                    >
                        {showResults && (
                            <div 
                                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${isThisVoted ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                                style={{ width: `${percentage}%` }}
                            />
                        )}

                        <div className="relative z-10 flex justify-between items-center">
                            <span className="font-medium">{option.text}</span>
                            
                            {showResults && (
                                <span className="text-sm font-bold ml-2">
                                    {percentage}% ({voteCount})
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}

            {voteId && (
                <div className="text-center mt-4 text-gray-400 text-sm">
                    Total votes: {totalVotes}
                </div>
            )}
        </div>
    );
} 