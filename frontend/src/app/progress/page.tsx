'use client';

import { useEffect, useState } from "react";

interface UserProgress {
  user: {
    name: string;
    email: string;
    nationality: string;
    current_location: string;
    score: number;
    interested_in: string[];
  };
  progress: {
    unlocked_countries: number;
    progress_percentage: number;
  };
  unlocked_countries: { country: string }[];
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/progress?user_id=2")
      .then((res) => res.json())
      .then((data: UserProgress) => {
        console.log("Progress data:", data);
        setProgress(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch progress:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-xl">Loading progress...</div>;
  if (!progress) return <div className="p-6 text-red-600">No progress data found.</div>;

  const { user, progress: stats, unlocked_countries } = progress;

  return (
    <div className="p-8 bg-[#FEFAE0] text-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Your Progress</h1>

      <div className="bg-white shadow-md p-6 rounded-lg border border-gray-300 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        <div className="space-y-1">
          <p><strong>Score:</strong> {user.score}</p>
          <p><strong>Nationality:</strong> {user.nationality}</p>
          <p><strong>Current Location:</strong> {user.current_location}</p>
          <p><strong>Progress:</strong> {stats.progress_percentage}%</p>
          <p><strong>Unlocked Countries:</strong> {stats.unlocked_countries}/232</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Interested In:</h3>
          <ul className="list-disc pl-6">
            {user.interested_in.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Unlocked Countries:</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 max-h-64 overflow-auto text-sm">
            {unlocked_countries.map((c) => (
              <li key={c.country}>{c.country}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
