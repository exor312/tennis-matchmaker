import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="mesh-gradient w-full rounded-2xl p-8 text-center">
        {/* Tennis ball icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="text-2xl">🎾</span>
        </div>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          Tennis Matchmaker
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Auto-matchmaking for open play sessions
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/setup"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start New Session
          </Link>
          <Link
            href="/checkin"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border font-medium text-foreground transition-colors hover:bg-muted"
          >
            Join Session
          </Link>
        </div>
      </div>
    </div>
  );
}
