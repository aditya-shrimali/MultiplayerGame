import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-center items-center gap-6">
      <h1>Play Games Online</h1>
      <Link href="/games/ludo"className="px-6 py-3 bg-green-600 rounded-lg">Play Ludo</Link>
    </main>
  );
}
