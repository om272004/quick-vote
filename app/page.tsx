import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/authOptions"
import Link from "next/link";
import SignInButton from "./components/SignInButton";


export default async function Home() {
  const session = await getServerSession(authOptions);

  return <main className="min-h-screen flex justify-center items-center">
    <div className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl text-center ">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 pb-2 mb-6">
        Instant, Real-Time Polling
      </h1>
      <h3 className="text-lg text-gray-300 mb-8">
        Create polls in seconds and watch the results update live. No page refreshes required.
      </h3>
      <div className="flex justify-center gap-4">
        {session ? (
          <Link className="bg-purple-600 hover:bg-purple-500 font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/30" href="/dashboard">
          Dashboard
        </Link>) : (
            <SignInButton />
        )}
      </div>
    </div>
  </main>
}