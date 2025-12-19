import { useState } from "react";
import "./FormPages.css";

// Profile Page (simple editable profile)
export default function ProfilePage({ profile, setProfile }) {
  const [age, setAge] = useState(profile.age || "");
  const [weight, setWeight] = useState(profile.weight || "");
  const [height, setHeight] = useState(profile.height || "");
  const [goal, setGoal] = useState(profile.goal || "weight loss");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Error: Not logged in");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: parseInt(age) || null,
          weight: parseInt(weight) || null,
          height: parseInt(height) || null,
          goal: goal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || "Failed to update profile"}`);
        setLoading(false);
        return;
      }

      setProfile({
        ...profile,
        age: parseInt(age) || "",
        weight: parseInt(weight) || "",
        height: parseInt(height) || "",
        goal: goal,
      });

      setMessage("✓ Profile saved successfully!");
      setLoading(false);

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Error: Connection failed. Make sure backend is running.");
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="box">
        <h2 className="title">👤 My Profile</h2>

        {message && (
          <div style={{
            marginBottom: "15px",
            padding: "10px",
            textAlign: "center",
            color: message.includes("Error") ? "red" : "green",
            backgroundColor: message.includes("Error") ? "#ffe6e6" : "#e6ffe6",
            borderRadius: "5px"
          }}>
            {message}
          </div>
        )}

        <form onSubmit={save} className="formPage">
          <div className="formSection">
            <label className="label">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 25"
            />
          </div>

          <div className="formRow">
            <div className="formSection">
              <label className="label">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
              />
            </div>

            <div className="formSection">
              <label className="label">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 180"
              />
            </div>
          </div>

          <div className="formSection">
            <label className="label">Fitness Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="weight loss">Lose Weight</option>
              <option value="muscle gain">Gain Muscle</option>
              <option value="maintenance">Maintain Weight</option>
              <option value="improve endurance">Improve Endurance</option>
            </select>
          </div>

          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}


