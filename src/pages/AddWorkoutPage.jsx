import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPages.css";

// Add Workout page
export default function AddWorkoutPage({ workouts, setWorkouts }) {
  const nav = useNavigate();

  // Simple form values
  const [name, setName] = useState("");
  const [type, setType] = useState("cardio");
  const [dur, setDur] = useState("");
  const [cal, setCal] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Error: Not logged in");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          type: type,
          duration: Number(dur || 0),
          caloriesBurned: Number(cal || 0),
          intensity: intensity,
          date: date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`Error: ${data.error || "Failed to save workout"}`);
        setLoading(false);
        return;
      }

      // Add to local state
      const item = {
        id: Date.now(),
        name: name,
        type: type,
        duration: Number(dur || 0),
        caloriesBurned: Number(cal || 0),
        intensity: intensity,
        date: date,
      };

      setWorkouts([...workouts, item]);

      // Clear form
      setName("");
      setType("cardio");
      setDur("");
      setCal("");
      setIntensity("moderate");

      setLoading(false);
      nav("/dashboard");
    } catch (err) {
      setError("Connection error. Make sure backend is running.");
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="box">
        <h2 className="title">💪 Add Workout</h2>

        {error && <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={submit} className="formPage">
          <div className="formSection">
            <label className="label">Workout Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Ups, Running, Weight Lifting"
              required
            />
          </div>

          <div className="formRow">
            <div className="formSection">
              <label className="label">Workout Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="formSection">
              <label className="label">Duration (minutes)</label>
              <input
                value={dur}
                onChange={(e) => setDur(e.target.value)}
                type="number"
                placeholder="e.g. 30"
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formSection">
              <label className="label">Calories Burned</label>
              <input
                value={cal}
                onChange={(e) => setCal(e.target.value)}
                type="number"
                placeholder="e.g. 250"
              />
            </div>

            <div className="formSection">
              <label className="label">Intensity</label>
              <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="formRow">
            <div className="formSection">
              <label className="label">Date</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
            </div>
          </div>

          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? "Saving..." : "Save Workout"}
          </button>
        </form>
      </div>
    </div>
  );
}


