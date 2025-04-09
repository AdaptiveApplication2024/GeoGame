'use client';

import { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { userId, setUserId } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (userId !== null) {
            router.push("/quiz");
        }
    });

    async function logIn() {
        const response = await fetch("http://localhost:5001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setUserId(data.user.user_id);
            // router.push("/quiz");
        }
    }


    return (
        <div className="h-full w-full p-10 flex flex-col items-center space-y-4 bg-[#FEFAE0]">
            <h1 className="text-6xl text-[#FEFAE0] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] cursor-default mb-6">Geographiac</h1>
            <h2 className="text-4xl">Back again?</h2>
            <div>
                <p className="loginLabel">Email</p>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-black rounded p-1 bg-opacity-70"
                    autoComplete="off"
                />
            </div>
            <div>
                <p className="loginLabel">Password</p>
                <input
                    type="text"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-black rounded p-1 bg-opacity-70"
                    autoComplete="off"
                />
            </div>
            <button className="p-2 bg-[#CCD5AE] text-opacity-70 rounded" onClick={logIn}>Log In</button>
            <div className="flex flex-col items-center space-y-2">
                <p>Or maybe you&apos;re new here?</p>
                <button className="p-2 bg-[#CCD5AE] text-opacity-70 rounded" onClick={() => router.push('/register')}>Sign Up</button>
            </div>
        </div>
    );
}
