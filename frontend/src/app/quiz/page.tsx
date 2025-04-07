'use client';

import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { useState, useEffect } from "react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface PrevQuestion {
    id: number;
    right: string;
    answer: string;
}

export default function QuizPage() {
    const [lat, setLat] = useState(53);
    const [lon, setLon] = useState(0);
    const [scale, setScale] = useState(1000);
    const [progress, setProgress] = useState({} as any); // eslint-disable-line
    const [question, setQuestion] = useState({} as any); // eslint-disable-line
    const [answer, setAnswer] = useState("");
    // const [currentCountry, setCurrentCountry] = useState("");
    // const [previousQuestions, setPreviousQuestions] = useState([{id: 1, right: 'Ireland', answer: 'UK'} as PrevQuestion]); // eslint-disable-line

    async function getQuestion() {
        const response = await fetch("http://localhost:5001/api/quiz?user_id=2", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            if(data.continent === "EU") {
                setLat(53);
                setLon(0);
                setScale(1000);
            }
            else if(data.continent === "NA") {
                setLat(37);
                setLon(-95);
            }
            else if(data.continent === "SA") {
                setLat(-15);
                setLon(-60);
            }
            else if(data.continent === "AF") {
                setLat(2);
                setLon(20);
                setScale(430);
            }
            else if(data.continent === "AS") {
                setLat(20);
                setLon(100);
            }
            else if(data.continent === "OC") {
                setLat(-25);
                setLon(135);
            }
            setQuestion(data);
        } else {
            console.log("Failed to get question");
        }
    }

    async function getProgress() {
        const response = await fetch("http://localhost:5001/api/progress?user_id=2", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setProgress(data);
        } else {
            console.log("Failed to get progress");
        }
    }

    async function submitAnswer() {
        const answerData = JSON.stringify({
            user_id: 2,
            question_id: question.question_id,
            answer: answer
        })
        console.log(answerData);
        const response = await fetch("http://localhost:5001/api/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: answerData
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // setPreviousQuestions([...previousQuestions, {id: question.id, right: question.answer, answer: answer}]);
            getProgress();
            getQuestion();
        } else {
            console.log("Failed to submit answer");
        }
    }

    useEffect(() => {
        getProgress();
        getQuestion();
    }, []);

    return (
        <div className="flex flex-grow w-full">
            <div className="w-1/5 h-3 p-2">
                <div className="flex flex-col space-y-1">
                    {progress.user &&
                        <><div className="h-13 border-2 border-black rounded p-2">
                            <h2 className="text-2xl">{progress.user.name}</h2>
                            <h4>{progress.user.email}</h4>
                        </div>
                        <div className="p-2">
                            <h3 className="text-xl">🏠 {progress.user.nationality}</h3>
                            { progress.user.nationality !== progress.user.current_location &&
                                <h3 className="text-xl">📍 {progress.user.current_location}</h3>
                            }
                            <h3 className="text-xl">Interested In:</h3>
                            <ul className="list-disc pl-5">
                                {progress.user.interested_in.map((interest: string) => (
                                    <li key={interest}>{interest}</li>
                                ))}
                            </ul>
                            <h3 className="text-xl">Score: {progress.user.score}</h3>
                            <h3 className="text-xl">Countries: {progress.progress.unlocked_countries}/232</h3>
                            <h3 className="text-xl">Progress: {progress.progress.progress_percentage}%</h3>
                            <h3 className="text-xl">Unlocked countries:</h3>
                            <div className="flex flex-col space-y-1 overflow-auto">
                                {progress.unlocked_countries.map((country) => (
                                    <h4 key={country.country}>{country.country}</h4>
                                ))}
                            </div>
                        </div></>
                    }
                </div>
            </div>
            <div className="flex flex-col w-3/5 h-full p-2">
                <div className="h-13 border-2 border-black rounded p-2">
                    <h2 className="text-2xl">{question.question}</h2>
                </div>
                <div className="flex-grow h-0 min-h-0">
                    <ComposableMap
                        projectionConfig={{
                            rotate: [-lon, -lat, 0],
                            center: [0, 0],
                            scale: scale
                          }}
                          style={{ width: "100%", height: "100%" }}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography 
                                        key={geo.rsmKey} 
                                        geography={geo}
                                        fill="#FFFFFF"
                                        stroke="#000000"
                                        // onClick={() => {
                                        //     setCurrentCountry(`${geo.properties.name}`);
                                        // }}
                                    />
                                ))
                            }
                        </Geographies>
                        {/* <Marker coordinates={[lon, lat]}>
                            <circle r={8} fill="#F53" />
                        </Marker> */}
                    </ComposableMap>
                </div>
                {/* <textarea className="h-26 border-2 border-black rounded p-2 w-full resize-none"></textarea> */}
                { question.options &&  question.options.map((option) => (
                        <div key={option} className="flex px-2 justify-between">
                            <p>{option}</p>
                            <input 
                                type="radio" 
                                id={option} 
                                value={option} 
                                checked={answer === option}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </div>
                    ))}
                <button
                    className="p-2 w-min bg-[#CCD5AE] text-opacity-70 rounded hover:opacity-75"
                    onClick={submitAnswer}
                >
                    Submit
                </button>
            </div>
            <div className="w-1/5 h-3 space-y-1 p-2">
                {/* {currentCountry} */}
                {/* {previousQuestions.map((question) => (
                    <div className="flex border-2 border-black rounded p-2 justify-evenly" key={question.id}>
                        <p>Question {question.id}</p>
                        <p>
                            ✅ {question.right} { question.right !== question.answer && "❌ "+question.answer }
                        </p>
                    </div>
                ))} */}
            </div>
        </div>
    );
}