"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return <button className="bg-purple-600 hover:bg-purple-500 font-bold py-3 px-8 rounded-xl transition-all cursor-pointer border border-white/20 shadow-lg shadow-purple-500/30" onClick={() => signOut()}>Sign Out</button>;
}