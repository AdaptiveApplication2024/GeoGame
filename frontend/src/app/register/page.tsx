'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [nationality, setNationality] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");
    const [age, setAge] = useState("");
    const [interestedIn, setInterestedIn] = useState([]);

    const interests = ["Capital", "Continent", "Population", "Currency", "Languages", "NationalSport"]

    async function register() {
        const registerData = JSON.stringify({
            name: name,
            email: email,
            password: password,
            nationality: nationality,
            current_location: currentLocation,
            age: age,
            interested_in: interestedIn.join(', ')
        })
        console.log(registerData);
        const response = await fetch("http://localhost:5001/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: registerData
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
            <div className="flex flex-col space-y-2">
            <div className="flex space-x-2 items-center justify-between">
                    <p>Name</p>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="border-2 border-black rounded p-1 bg-opacity-70"
                    />
                </div>
                <div className="flex space-x-2 items-center justify-between">
                    <p>Email</p>
                    <input 
                        type="text" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="border-2 border-black rounded p-1 bg-opacity-70"
                    />
                </div>
                <div className="flex space-x-2 items-center justify-between">
                    <p>Password</p>
                    <input 
                        type="text" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="border-2 border-black rounded p-1 bg-opacity-70" 
                    />
                </div>
                <div className="flex space-x-2 items-center justify-between">
                    <p>Nationality</p>
                    <input 
                        type="text" 
                        id="nationality" 
                        value={nationality} 
                        onChange={(e) => setNationality(e.target.value)} 
                        className="border-2 border-black rounded p-1 bg-opacity-70" 
                    />
                </div>
                <div className="flex space-x-2 items-center justify-between">
                    <p>Current Location</p>
                    <input 
                        type="text" 
                        id="currentLocation" 
                        value={currentLocation} 
                        onChange={(e) => setCurrentLocation(e.target.value)} 
                        className="border-2 border-black rounded p-1 bg-opacity-70" 
                    />
                </div>
                <div className="flex space-x-2 items-center justify-between">
                    <p>Age</p>
                    <input 
                        type="text" 
                        id="age" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
                        className="border-2 border-black rounded p-1 bg-opacity-70" 
                    />
                </div>
                <div className="">
                    <p>Interested In:</p>
                    {interests.map((interest) => (
                        <div key={interest} className="flex px-2 justify-between">
                            <p>{interest}</p>
                            <input 
                                type="checkbox" 
                                id={interest} 
                                value={interest} 
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setInterestedIn([...interestedIn, interest]);
                                    } else {
                                        setInterestedIn(interestedIn.filter(i => i !== interest));
                                    }
                                    console.log(interestedIn);
                                }} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            <button className="p-2 bg-[#CCD5AE] text-opacity-70 rounded" onClick={register}>Sign up</button>
            <div className="flex flex-col items-center space-y-2">
                <p>Or maybe you&apos;ve been here before?</p>
                <button className="p-2 bg-[#CCD5AE] text-opacity-70 rounded" onClick={() => router.push('/')}>Log In</button>
            </div>
        </div>
    );
}