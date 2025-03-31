'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();

    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [nationality, setNationality] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");

    async function register() {
        const response = await fetch("http://localhost:5001/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                nationality: nationality,
                currentLocation: currentLocation
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            router.push("/quiz");
        } else {
            console.log("Failed to register");
        }
    }


    return (
        <div className="h-full w-full p-10 flex flex-col items-center space-y-4 bg-[#FEFAE0]">
            <h1 className="text-4xl">First time? Welcome!</h1>
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
            <div>
                <p>Nationality</p>
                <input 
                    type="text" 
                    id="nationality" 
                    value={nationality} 
                    onChange={(e) => setNationality(e.target.value)} 
                    className="border-2 border-black rounded p-1 bg-opacity-70" 
                />
            </div>
            <div>
                <p>Current Location</p>
                <input 
                    type="text" 
                    id="currentLocation" 
                    value={currentLocation} 
                    onChange={(e) => setCurrentLocation(e.target.value)} 
                    className="border-2 border-black rounded p-1 bg-opacity-70" 
                />
            </div>
            <button className="p-2 bg-[#CCD5AE] text-opacity-70 rounded" onClick={register}>Sign up</button>
            <div className="flex flex-col items-center space-y-2">
                <p>Or maybe you&apos;ve been here before?</p>
                <button className="p-2 bg-[#CCD5AE] text-opacity-70 rounded" onClick={() => router.push('/')}>Log In</button>
            </div>
        </div>
    );
}