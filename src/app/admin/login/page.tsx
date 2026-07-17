"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-[0.4em] text-white/40 uppercase block mb-4">
            shunature.one
          </span>
          <h1 className="text-3xl font-light tracking-wide mb-3">Admin Access</h1>
          <p className="text-white/40 text-sm">Sign in to manage your content.</p>
        </div>

        {/* Login Options */}
        <div className="flex flex-col gap-4">
          {/* GitHub */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
            className="group flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.620.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="text-sm tracking-wide">Continue with GitHub</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-mono">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Passkey */}
          <button
            onClick={() => signIn("passkey", { callbackUrl: "/admin" })}
            className="group flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-indigo-600/20 border border-indigo-500/30 rounded-xl hover:bg-indigo-600/30 hover:border-indigo-400/50 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
            </svg>
            <span className="text-sm tracking-wide text-indigo-200">Sign in with Passkey</span>
          </button>
        </div>

        <p className="text-center text-white/20 text-xs mt-8 font-mono">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
