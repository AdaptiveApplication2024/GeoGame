'use client';

import { useContext } from "react";
import { UserContext } from "../userContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const { setUserId } = useContext(UserContext);

    return (
        <div className="flex font-bold text-gray-800 justify-between h-18 bg-[#EFEBCE] p-2 border-b-1 border-black/50">
            <div className="flex space-x-8">
                <h1 className="text-5xl text-[#EFEBCE] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] cursor-default">Geographiac</h1>
                <button className="text-4xl rounded hover:bg-green-600 hover:bg-opacity-10" onClick={() => {
                    router.push("/quiz");
                }}>Quiz</button>
                <button className="text-4xl rounded hover:bg-green-600 hover:bg-opacity-10" onClick={() => {
                    router.push("/progress");
                }}>Progress</button>
            </div>
            <button className="text-4xl mx-2" onClick={() => {
                setUserId(null);
            }}>Log Out</button>
        </div>
    );
}
