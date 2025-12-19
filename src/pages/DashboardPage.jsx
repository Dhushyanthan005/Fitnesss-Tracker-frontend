import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

// Dashboard page
export default function DashboardPage({ workouts, meals, stepsData, setStepsData }) {
  const nav = useNavigate();

  // today's date as a string like "2025-12-18"
  const today = new Date().toISOString().slice(0, 10);

  // small local inputs to update steps for today
  const [stepInput, setStepInput] = useState("");

  // computed "overview" numbers
  const [stepsToday, setStepsToday] = useState(0);
  const [calToday, setCalToday] = useState(0);
  const [workoutsToday, setWorkoutsToday] = useState(0);

  // useEffect is a basic hook for "do something when data changes"
  useEffect(() => {
    // steps
    const found = stepsData.find((x) => x.date === today);
    setStepsToday(found ? Number(found.steps) : 0);

    // workouts for today
    const w = workouts.filter((x) => x.date === today);
    setWorkoutsToday(w.length);

    // calories burned today = sum of workout calories
    let total = 0;
    for (let i = 0; i < w.length; i++) {
      total = total + Number(w[i].caloriesBurned || 0);
    }
    setCalToday(total);
  }, [workouts, stepsData, today]);

  function saveSteps(e) {
    e.preventDefault();

    const val = Number(stepInput || 0);

    // Replace or add today's steps (very simple)
    const exists = stepsData.find((x) => x.date === today);
    if (exists) {
      const next = stepsData.map((x) => {
        if (x.date === today) {
          return { ...x, steps: val };
        }
        return x;
      });
      setStepsData(next);
    } else {
      setStepsData([...stepsData, { id: Date.now(), date: today, steps: val }]);
    }

    setStepInput("");
  }

  return (
    <div className="app">
      <h2 className="title">Dashboard</h2>

      <div className="dashboardGrid">
        <div className="statCard">
          <div className="statIcon">👟</div>
          <div className="statContent">
            <h3>Steps Today</h3>
            <p className="statValue">{stepsToday.toLocaleString()}</p>
            <p className="statLabel">steps</p>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🔥</div>
          <div className="statContent">
            <h3>Calories Burned</h3>
            <p className="statValue">{calToday}</p>
            <p className="statLabel">kcal</p>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">💪</div>
          <div className="statContent">
            <h3>Workouts</h3>
            <p className="statValue">{workoutsToday}</p>
            <p className="statLabel">completed today</p>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🍎</div>
          <div className="statContent">
            <h3>Meals Tracked</h3>
            <p className="statValue">{meals.filter((m) => m.date === today).length}</p>
            <p className="statLabel">meals today</p>
          </div>
        </div>
      </div>

      <div className="box">
        <h3>📝 Update Steps</h3>
        <form onSubmit={saveSteps} className="stepForm">
          <label className="label">Steps for {today}</label>
          <div className="stepInputGroup">
            <input
              type="number"
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              placeholder="Enter number of steps"
            />
            <button type="submit" className="primaryButton">Save</button>
          </div>
        </form>
      </div>

      <div className="box">
        <h3>⚡ Quick Actions</h3>
        <div className="actionButtons">
          <button 
            className="actionButton"
            onClick={() => nav("/add-workout")}
          >
            ➕ Add Workout
          </button>
          <button 
            className="actionButton"
            onClick={() => nav("/add-meal")}
          >
            ➕ Add Meal
          </button>
          <button 
            className="actionButton"
            onClick={() => nav("/history")}
          >
            📋 View History
          </button>
          <button 
            className="actionButton"
            onClick={() => nav("/progress")}
          >
            📈 View Progress
          </button>
          <button 
            className="actionButton"
            onClick={() => nav("/profile")}
          >
            👤 Profile
          </button>
        </div>
      </div>
    </div>
  );
}


