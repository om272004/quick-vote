"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function () {
    const [options, setOptions] = useState<string[]>([]);
    const [currentOption, setCurrentOption] = useState("");
    const [question, setQuestion] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const router = useRouter();

    const onClickHandler = () => {
        setOptions(prev => [...prev, currentOption]);
        setCurrentOption("");
    }

    const handleRemove = (indexToRemove: number) => {
        setOptions(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question || options.length < 2) {
            alert("please add a question and at least 2 options.");
            return;
        }

        console.log("Submitting poll : ");
        console.log("Question : ", question);
        console.log("Options", options);

        try {
            const response = await fetch('/api/polls/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    question: question,
                    options: options,
                    expiresAt : expiresAt,
                }),
            });

            if (response.ok) {
                setQuestion("");
                setOptions([]);
                alert("Poll created successfully")
                router.push('/dashboard')
            } else {
                const error = await response.json();
                alert(`Error : ${error.message || "Failed to create poll"}`);
            }
        } catch (error) {
            console.error("Failed to submit poll : ", error);
            alert("And error Occured. Please try again")
        }
    }

    return <form onSubmit={handleSubmit} className="min-h-screen flex justify-center items-center">
        <div className="w-80 lg:w-2/5 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border  border-white/20">
            <h1 className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-400 to-pink-500 mb-6">Create Poll</h1>
            <div className="flex flex-col pb-4">
                <label htmlFor="question">
                    <h4 className="font-semibold text-lg">Question</h4>
                </label>
                <input type="text"
                    className="border border-white/30 rounded-lg text-semibold w-full p-4"
                    id="question"
                    placeholder="Enter your Question"
                    onChange={(e) => setQuestion(e.target.value)}
                    value={question} />
            </div>
            <div>
                <div>
                    {options.map((optionText, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl animate-in fade-in slide-in-from-bottom-2 my-2"
                        >
                            <div className="flex items-center">
                                <span className="text-xs font-bold bg-white/10 text-gray-300 px-2 py-1 rounded-md">
                                    #{index + 1}
                                </span>

                                <span className="text-white font-medium pl-4">
                                    {optionText}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-gray-400 hover:text-red-400 hover:bg-white/5 p-2 rounded-lg transition-all"
                            >
                                -
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl transition-all focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 mb-8">
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-xs font-bold bg-white/10 text-gray-400 px-2 py-1 rounded-md">
                            #{options.length + 1}
                        </span>

                        <input
                            type="text"
                            className="bg-transparent border border-none text-white placeholder:text-gray-500 focus:ring-0 w-full p-1 outline-none"
                            placeholder="Type an option and hit Enter..."
                            onChange={(e) => setCurrentOption(e.target.value)}
                            value={currentOption}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onClickHandler();
                                }
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onClickHandler}
                        disabled={!currentOption.trim()}
                        className="bg-white/10 hover:bg-purple-600 text-white p-2 rounded-lg transition-all ml-2 disabled:opacity-50 disabled:hover:bg-white/10"
                        title="Add Option"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>

            </div>

            <div className="flex flex-col gap-y-2 mb-8">
    <label htmlFor="expiry" className="font-medium text-gray-300 ml-1">
        Poll Expires At (Optional)
    </label>
    <input 
        type="datetime-local"
        id="expiry"
        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
    />
</div>
            <button type="submit" className="rounded-lg bg-white/10 py-2 w-full mt-4 border border-white/20 hover:border-green-600/25">
                Create Poll
            </button>
        </div>
    </form>
}