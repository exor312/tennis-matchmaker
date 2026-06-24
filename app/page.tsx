'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('playerName', name.trim());
      router.push('/bracket');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
      <div className="flex w-full max-w-sm flex-col items-center">
        <h1 className="text-4xl font-black uppercase tracking-widest text-white">
          MATCHMAKER
        </h1>
        <p className="mt-2 text-sm text-white/50">Tennis open play, simplified</p>

        <form onSubmit={handleSubmit} className="mt-10 w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 transition-all focus:border-[#22c55e]/50 focus:outline-none focus:[box-shadow:0_0_0_2px_rgba(34,197,94,0.15)]"
          />
          <button
            type="submit"
            className="mt-4 h-12 w-full rounded-full bg-[#22c55e] text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-[#16a34a] active:scale-[0.97]"
          >
            ENTER
          </button>
        </form>

        <p className="mt-3 text-xs text-white/30">No signup needed — just play</p>
      </div>
    </div>
  );
}
