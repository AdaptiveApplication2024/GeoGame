'use client';

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { UserContext } from "../userContext";
import { useRouter } from "next/navigation";


const geoUrl = "geography.json";

const continentMap: Record<string, string> = {
    AF: "Africa",
    AN: "Antarctica",
    AS: "Asia",
    EU: "Europe",
    NA: "North America",
    OC: "Oceania",
    SA: "South America",
};

interface PrevQuestion {
    question: string;
    correct: boolean;
    answer: string;
}

export default function QuizPage() {
    const router = useRouter();
    const { userId } = useContext(UserContext);

    const [lat, setLat] = useState(53);
    const [lon, setLon] = useState(0);
    const [scale, setScale] = useState(1000);
    const [progress, setProgress] = useState({} as any); // eslint-disable-line
    const [question, setQuestion] = useState({} as any); // eslint-disable-line
    const [answer, setAnswer] = useState("");
    const [currentCountry, setCurrentCountry] = useState("");
    const [previousQuestions, setPreviousQuestions] = useState<PrevQuestion[]>([]);

    useEffect(() => {
        if (userId === null) {
            router.push("/");
        }
    });

    async function getQuestion() {
        const response = await fetch("http://localhost:5001/api/quiz?user_id="+userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            if(data.continent === "EU") {
                setLat(53);
                setLon(10);
                setScale(900);
            } else if(data.continent === "NA") {
                setLat(39);
                setLon(-103);
                setScale(520);
            } else if(data.continent === "SA") {
                setLat(-22);
                setLon(-60);
                setScale(450);
            } else if(data.continent === "AF") {
                setLat(2);
                setLon(20);
                setScale(430);
            } else if(data.continent === "AS") {
                setLat(33);
                setLon(72);
                setScale(550);
            } else if(data.continent === "OC") {
                setLat(-20);
                setLon(150);
                setScale(500);
            }
            setQuestion(data);
        }
    }

    async function getProgress() {
        const response = await fetch("http://localhost:5001/api/progress?user_id="+userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            setProgress(data);
        }
    }

    async function submitAnswer() {
        let answerForSubmission: number | string = answer;
        if (Number(answer)) {
            answerForSubmission = Number(answer);
        }
        if(question.question.split(" ")[0] === "Where") {
            answerForSubmission = currentCountry;
        }
        if (answerForSubmission === "") {
            return;
        }
        const answerData = JSON.stringify({
            user_id: userId,
            question_id: question.question_id,
            answer: answerForSubmission,
        });
        const response = await fetch("http://localhost:5001/api/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: answerData,
        });
        if (response.ok) {
            const data = await response.json();
            let currentPreviousQuestions = [...previousQuestions];
            if (currentPreviousQuestions.length > 6) {
                currentPreviousQuestions = currentPreviousQuestions.slice(0, 6);
            }
            if(question.question.split(" ")[0] === "Where" && !data.correct) {
                setPreviousQuestions([{question: question.question, correct: data.correct, answer: currentCountry}, ...currentPreviousQuestions]);
            } else {
                setPreviousQuestions([{question: question.question, correct: data.correct, answer: answer}, ...currentPreviousQuestions]);
            }
            setCurrentCountry("");
            getProgress();
            getQuestion();
            setAnswer("");
        }
    }

    useEffect(() => {
        getProgress();
        getQuestion();
    }, []);

    return (
        <>
            <Navbar />
            { Object.keys(question).length > 0 &&
            <div className="flex flex-grow w-full bg-[#FEFAE0]">
                <div className="w-1/5 h-3 p-2">
                    <div className="flex flex-col space-y-1">
                        {progress.user &&
                            <><div className="whiteBox h-13">
                                <h2 className="text-2xl">{progress.user.name}</h2>
                                <h4>{progress.user.email}</h4>
                            </div>
                            <div className="p-2">
                                {/* <h3 className="text-xl">🏠 {progress.user.nationality}</h3>
                                { progress.user.nationality !== progress.user.current_location &&
                                    <h3 className="text-xl">📍 {progress.user.current_location}</h3>
                                }
                                <h3 className="text-xl">Interested In:</h3>
                                <ul className="list-disc pl-5">
                                    {progress.user.interested_in.map((interest: string) => (
                                        <li key={interest}>{interest}</li>
                                    ))}
                                </ul> */}
                                <h3 className="text-xl">Score: {progress.user.score}</h3>
                                <h3 className="text-xl">Countries: {progress.progress.unlocked_countries}/232</h3>
                                <h3 className="text-xl">Progress: {progress.progress.progress_percentage}%</h3>
                                <h3 className="text-xl">Unlocked countries:</h3>
                                <div className="flex flex-col space-y-1 overflow-auto">
                                    {progress.unlocked_countries.map((unlockedCountry: {country: string}) => (
                                        <h4 key={unlockedCountry.country}>{unlockedCountry.country}</h4>
                                    ))}
                                </div>
                            </div></>
                        }
                    </div>
                </div>
                <div className="flex flex-col w-3/5 h-full p-2">
                    <div className="whiteBox h-13">
                        <h2 className="text-2xl">{question.question}</h2>
                    </div>
                    <div className="flex-grow h-0 min-h-0">
                        <ComposableMap
                            projectionConfig={{
                                rotate: [-lon, -lat, 0],
                                center: [0, 0],
                                scale: scale,
                            }}
                            style={{ width: "100%", height: "100%", backgroundColor: "#FFFFFF" }}
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="#FEFAE0"
                                            stroke="#000000"
                                            onClick={() => {
                                                setCurrentCountry(`${geo.properties.name}`);
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                            {/* <Marker coordinates={[lon, lat]}>
                                <circle r={8} fill="#F53" />
                            </Marker> */}
                        </ComposableMap>
                    </div>
                    <div className="whiteBox">
                        { question.options && question.options.map((option: string | number) => (
                            option.toString() !== "" && (
                                <div key={option} className="flex px-2 justify-between">
                                    <p>{
                                        continentMap[option] ?? (typeof option === 'number' ? option.toLocaleString('en') : option)
                                    }</p>
                                    <input
                                        type="radio"
                                        id={option.toString()}
                                        value={option}
                                        checked={answer === option.toString()}
                                        onChange={(e) => setAnswer(e.target.value)}
                                    />
                                </div>
                            )
                        ))}
                        <button
                            className="mt-2 p-2 w-min bg-[#CCD5AE] text-opacity-70 rounded hover:opacity-75"
                            onClick={submitAnswer}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="w-1/5 h-full space-y-1 p-2">
                    <h2 className="text-2xl font-semibold">Recent Questions</h2>
                    {previousQuestions.map((prevQuestion, i) => (
                        <div className="whiteBox" key={'prevQuestion'+i}>
                            <h3 className="text-xl">{prevQuestion.question}</h3>
                            <div className="flex">
                                <p>
                                    {prevQuestion.correct ? "✅" : "❌"} {continentMap[prevQuestion.answer] ?? prevQuestion.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            }
        </>
    );
}
