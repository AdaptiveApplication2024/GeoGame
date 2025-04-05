'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");

    async function logIn() {
        const response = await fetch("http://localhost:5001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            router.push("/quiz");
        } else {
            console.log("Failed to log in");
        }
    }


    return (
        <div className="h-full w-full p-10 flex flex-col items-center space-y-4 bg-[#FEFAE0]">
            <h1 className="text-4xl">Back again?</h1>
            <div>
                <p>Email</p>
                <input 
                    type="text" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="border-2 border-black rounded p-1 bg-opacity-70"
                />
            </div>
            <div>
                <p>Password</p>
                <input 
                    type="text" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="border-2 border-black rounded p-1 bg-opacity-70" 
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