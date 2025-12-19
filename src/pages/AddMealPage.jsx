import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPages.css";

// Add Meal page
export default function AddMealPage({ meals, setMeals }) {
  const nav = useNavigate();

  // Basic form state
  const [name, setName] = useState("");
  const [cal, setCal] = useState("");
  const [time, setTime] = useState("breakfast");
  const [notes, setNotes] = useState("");
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          calories: Number(cal || 0),
          mealType: time,
          date: date,
          notes: notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`Error: ${data.error || "Failed to save meal"}`);
        setLoading(false);
        return;
      }

      // Add to local state
      const item = {
        id: Date.now(),
        name: name,
        calories: Number(cal || 0),
        mealType: time,
        notes: notes,
        date: date,
      };

      setMeals([...meals, item]);

      // clear form
      setName("");
      setCal("");
      setTime("breakfast");
      setNotes("");

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
        <h2 className="title">🍎 Add Meal</h2>

        {error && <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={submit} className="formPage">
          <div className="formSection">
            <label className="label">Meal Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken Salad, Pasta, Smoothie"
              required
            />
          </div>

          <div className="formRow">
            <div className="formSection">
              <label className="label">Meal Time</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="formSection">
              <label className="label">Calories</label>
              <input
                value={cal}
                onChange={(e) => setCal(e.target.value)}
                type="number"
                placeholder="e.g. 450"
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formSection">
              <label className="label">Date</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
            </div>
          </div>

          <div className="formSection">
            <label className="label">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about your meal..."
              style={{ minHeight: "80px" }}
            />
          </div>

          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? "Saving..." : "Save Meal"}
          </button>
        </form>
      </div>
    </div>
  );
}


