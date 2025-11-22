"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  const handleSignIn = () => {
    const email = prompt("Please enter your email to sign in:");
    if (email) {
      signIn("email", { email, redirect: false });
      alert("Check your email for a sign-in link!");
    }
  };

  return <button className="bg-purple-600 hover:bg-purple-500 font-bold py-3 px-8 rounded-xl transition-all cursor-pointer border border-white/20 shadow-lg shadow-purple-500/30" onClick={handleSignIn}>Sign In</button>;
}