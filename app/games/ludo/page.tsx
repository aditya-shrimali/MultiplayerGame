"use client";

import { createLudoBoard } from "@/app/canvas/LudoBoard";
import { DiceStore } from "@/app/gameStore";
import { useSocket } from "@/app/hooks/useSocket";
import { useEffect, useRef, useState } from "react";


export default function LudoPage() {
  const socket= useSocket();
  const [name, setName]=useState("");
  const [roomId, setRoomId]=useState("");
  
  const [diceValue, setDiceValue]=useState<number | null>(null);
  const [rolling, setRolling]=useState(false);

  const boardRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(boardRef.current){
      createLudoBoard(boardRef.current);   

    }
  },[])

const rollDice=()=> {
  if (rolling) return;

  setRolling(true);

  // small delay to feel like a roll
  setTimeout(() => {
    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValue(value);
    setRolling(false);
  }, 400);
}

useEffect(()=>{
  DiceStore.value = diceValue;
}, [diceValue]);

  const createRoom=()=>{
    socket?.emit("create_room",{name});
    socket?.on("room_created", (id)=>setRoomId(id));
  };

  return(
    <div className="p-6">
      {!roomId?(
        <div className="space-y-4">
          <input className="p-2 text-black"
          placeholder="Enter your name"
          onChange={(e)=>setName(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-600 rounded"
          onClick={createRoom}
          >Create Room</button>
        </div>
      ):(
        <p>Room Created: {roomId}</p>
      )}

      <div ref={boardRef} className="w-[400px] h-[400px] bg-white rounded-lg"></div>
      <div className="mt-6 flex flex-col items-center gap-3">
  <button
    onClick={rollDice}
    disabled={rolling}
    className={`w-20 h-20 rounded-xl text-3xl font-bold
      ${rolling ? "bg-gray-500" : "bg-white text-black"}
    `}
  >
    {rolling ? "🎲" : diceValue ?? "Roll"}
  </button>

  {diceValue && (
    <p className="text-lg">Dice rolled: {diceValue}</p>
  )}
</div>

    </div>
  )
}


