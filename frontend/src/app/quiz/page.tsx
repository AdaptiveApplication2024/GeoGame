'use client';

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { useState } from "react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface PrevQuestion {
    id: number;
    right: string;
    answer: string;
}

export default function QuizPage() {
    // const [lat, setLat] = useState(0);
    // const [lon, setLon] = useState(0);
    const [currentCountry, setCurrentCountry] = useState("");
    const [previousQuestions, setPreviousQuestions] = useState([{id: 1, right: 'Ireland', answer: 'UK'} as PrevQuestion]); // eslint-disable-line

    const lat = 53.3;
    const lon = -6.3;
    const question = "What country is this?";

    return (
        <div className="flex flex-grow w-full">
            <div className="w-1/5 h-3">
            </div>
            <div className="flex flex-col w-3/5 h-full p-2">
                <div className="h-13 border-2 border-black rounded p-2">
                    <h2 className="text-2xl">{question}</h2>
                </div>
                <div className="flex-grow h-0 min-h-0">
                    <ComposableMap
                        projectionConfig={{
                            rotate: [-lon, -lat, 0],
                            center: [0, 0],
                            scale: 1000
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
                                    onClick={() => {
                                        setCurrentCountry(`${geo.properties.name}`);
                                    }}
                                />
                            ))
                            }
                        </Geographies>
                        <Marker coordinates={[lon, lat]}>
                            <circle r={8} fill="#F53" />
                        </Marker>
                    </ComposableMap>
                </div>
                <textarea className="h-26 border-2 border-black rounded p-2 w-full resize-none">

                </textarea>
            </div>
            <div className="w-1/5 h-3 space-y-1 p-2">
                {currentCountry}
                {previousQuestions.map((question) => (
                    <div className="flex border-2 border-black rounded p-2 justify-evenly" key={question.id}>
                        <p>Question {question.id}</p>
                        <p>
                            ✅ {question.right} { question.right !== question.answer && "❌ "+question.answer }
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}