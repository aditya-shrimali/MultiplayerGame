import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      
      {/* 🔥 HERO BANNER */}
      <section className="relative h-[50vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/banner-games.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Free Multiplayer Games Online
          </h1>
          <p className="mt-4 text-gray-300 mx-auto max-w-2xl">
            Play classic board games like Ludo and Snake & Ladders with friends
            and players around the world. No sign-up required.
          </p>

          <Link
            href="/games/ludo"
            className="inline-block mt-6 px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl text-lg font-semibold transition"
          >
            Play Now
          </Link>
        </div>
      </section>

      {/* 🎲 GAME CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* LUDO CARD */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition">
          <div className="relative h-48">
            <Image
              src="/ludo.png"
              alt="Play Ludo Online"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold">Ludo Multiplayer</h2>
            <p className="mt-2 text-gray-300 text-sm">
              Play classic Ludo online with friends or random players.
            </p>

            <Link
              href="/games/ludo"
              className="mt-4 inline-block w-full text-center bg-green-600 hover:bg-green-500 py-3 rounded-lg font-semibold transition"
            >
              Play Ludo
            </Link>
          </div>
        </div>

        {/* SNAKE & LADDERS CARD */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition">
          <div className="relative h-48">
            <Image
              src="/snake-ladders.png"
              alt="Snake and Ladders Online"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold">Snake & Ladders</h2>
            <p className="mt-2 text-gray-300 text-sm">
              Roll the dice and climb ladders in this timeless board game.
            </p>

            <button
              disabled
              className="mt-4 w-full py-3 bg-yellow-500/50 text-black rounded-lg font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* FUTURE GAME CARD */}
        <div className="border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-6">
          <span className="text-lg font-semibold">More Games</span>
          <span className="text-sm mt-2">Coming soon…</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pb-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Multiplayer Board Games
      </footer>
    </main>
  );
}
