"use client";

import { createLudoBoard } from "@/app/canvas/LudoBoard";
import { DiceStore } from "@/app/gameStore";
import { useSocket } from "@/app/hooks/useSocket";
import { useEffect, useRef, useState } from "react";

type Phase = "LOBBY" | "STARTING" | "GAME";

export default function LudoPage() {
  const socket = useSocket();

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [phase, setPhase] = useState<Phase>("LOBBY");

  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rollCount, setRollCount] = useState(0);
  const [rolling, setRolling] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

  // 🎮 Create board ONLY when game starts
  useEffect(() => {
    if (phase === "GAME" && boardRef.current) {
      createLudoBoard(boardRef.current);
    }
  }, [phase]);

  const rollDice = () => {
    if (rolling) return;

    setRolling(true);
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      setDiceValue(value);
      setRollCount((c) => c + 1);
      setRolling(false);
    }, 400);
  };

  useEffect(() => {
    if (diceValue !== null && rollCount > 0) {
      DiceStore.value = diceValue;
      DiceStore.rollId++;
    }
  }, [rollCount]);

  const createRoom = () => {
    socket?.emit("create_room", { name });

    socket?.once("room_created", (id) => {
      setRoomId(id);
      setPhase("STARTING");

      // ⏳ small transition before game loads
      setTimeout(() => {
        setPhase("GAME");
      }, 1200);
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      {/* HEADER */}
      <header className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎲 Ludo Multiplayer</h1>
        {roomId && (
          <span className="px-4 py-1 bg-green-600 rounded-full text-sm">
            Room: {roomId}
          </span>
        )}
      </header>

      {/* ===== LOBBY ===== */}
      {phase === "LOBBY" && (
        <section className="flex items-center justify-center h-[80vh]">
          <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Create Game Room
            </h2>

            <input
              className="w-full mb-4 p-3 rounded bg-slate-700 text-white outline-none"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              onClick={createRoom}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition"
            >
              Create Room
            </button>
          </div>
        </section>
      )}

      {/* ===== STARTING ===== */}
      {phase === "STARTING" && (
        <section className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <div className="text-3xl animate-pulse">🎲</div>
          <h2 className="text-xl font-semibold">Game Starting…</h2>
          <p className="text-gray-400">
            Preparing board and waiting for players
          </p>
        </section>
      )}

      {/* ===== GAME ===== */}
      {phase === "GAME" && (
  <section className="relative flex-1 flex flex-col items-center justify-center p-6">

    {/* BOARD */}
    <div
      ref={boardRef}
      className="bg-white rounded-2xl shadow-2xl p-2 mb-28"
    />

    {/* 🎲 DICE — FIXED BOTTOM */}
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-slate-800 rounded-2xl px-10 py-6 flex flex-col items-center gap-3 shadow-2xl">
        <button
          onClick={rollDice}
          disabled={rolling}
          className={`w-24 h-24 rounded-2xl text-4xl font-bold transition cursor-pointer
            ${
              rolling
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:scale-105"
            }
          `}
        >
          {rolling ? "🎲" : diceValue ?? "Roll"}
        </button>

        {diceValue && (
          <p className="text-gray-300 text-sm">
            Rolled: <span className="font-bold">{diceValue}</span>
          </p>
        )}
      </div>
    </div>

  </section>
)}

    </main>
  );
}
