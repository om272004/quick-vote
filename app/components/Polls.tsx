import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { CopyButton } from "./CopyButton";
import Link from "next/link";
import { DeletePollButton } from "./DeletePollButton";

 export function getExpiryStatus(expiresAt: Date | null) {
    if (!expiresAt) return null;
    
    const now = new Date();
    const end = new Date(expiresAt);
    const diff = end.getTime() - now.getTime();

    if (diff < 0) {
        return <span className="text-red-400 text-xs font-bold bg-red-400/10 px-2 py-1 rounded">Ended</span>;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return <span className="text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded">Ends in {days} days</span>;
    }
    if (hours > 0) {
        return <span className="text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded">Ends in {hours} hours</span>;
    }
    return <span className="text-orange-400 text-xs font-bold bg-orange-400/10 px-2 py-1 rounded">Ends soon</span>;
}

export async function Polls() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

    const polls = await db.poll.findMany({
        where: { userId: session?.user.id },
        orderBy: { id: 'desc' }
    });

    if (polls.length === 0) {
        return (
            <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                <p className="text-gray-400 text-lg">You haven't created any polls yet.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((p) => (
                <div 
                    key={p.id} 
                    className="group flex flex-col justify-between backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${p.expiresAt && new Date() > p.expiresAt ? 'bg-red-500' : 'bg-green-400 animate-pulse'}`}></span>
                                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                                    {p.expiresAt && new Date() > p.expiresAt ? 'Closed' : 'Active'}
                                </span>
                            </div>
                            {getExpiryStatus(p.expiresAt)}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-purple-200 transition-colors">
                            {p.question}
                        </h3>
                    </div>
                    
                    <div className="flex gap-3 mt-4 pt-4 border-t border-white/5 items-center">
                        <Link 
                            href={`/poll/${p.id}`}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-bold text-center transition-all shadow-lg shadow-indigo-500/20"
                        >
                            View
                        </Link>
                        <div className="flex-1">
                            <CopyButton pollId={p.id} />
                        </div>
                        <DeletePollButton pollId={p.id} />
                    </div>
                </div>
            ))}
        </div>
    );
}