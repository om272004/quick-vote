import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import SignOutButton from "../components/SignOutButton";
import { Polls } from "../components/Polls";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Dashboard
            </h1>
            <p className="text-blue-200/70 mt-1">
              Welcome back, <span className="text-white font-medium">{session.user.email}</span>
            </p>
          </div>
          <div>
            <Link href="/create-poll" className="bg-purple-600 hover:bg-purple-500 font-bold py-3 px-8 rounded-xl transition-all cursor-pointer border border-white/20 shadow-lg shadow-purple-500/30 mr-2">Create Poll</Link>

             <SignOutButton />
          </div>
                  
          </div>
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center gap-4 mb-6">
             <h2 className="text-2xl font-bold text-white">Your Polls</h2>
             <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          
          <Polls /> 
        </div>

      </div>
    </div>
  );
}