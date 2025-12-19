import { useMemo, useState, useEffect } from "react";
import "./HistoryPage.css";

// Workout & Diet History page
export default function HistoryPage({ workouts, setWorkouts, meals, setMeals }) {
  // Loading states
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [error, setError] = useState("");

  // Simple filters (very beginner)
  const [workCat, setWorkCat] = useState("All");
  const [workDate, setWorkDate] = useState("");
  const [workMinCal, setWorkMinCal] = useState("");

  const [mealCat, setMealCat] = useState("All");
  const [mealDate, setMealDate] = useState("");
  const [mealMinCal, setMealMinCal] = useState("");

  // Fetch workouts from database on component mount
  useEffect(() => {
    fetchWorkouts();
    fetchMeals();
  }, []);

  async function fetchWorkouts() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingWorkouts(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workouts`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
      setLoadingWorkouts(false);
    } catch (err) {
      console.log("Error fetching workouts:", err);
      setLoadingWorkouts(false);
    }
  }

  async function fetchMeals() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingMeals(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/meals`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      }
      setLoadingMeals(false);
    } catch (err) {
      console.log("Error fetching meals:", err);
      setLoadingMeals(false);
    }
  }

  // useMemo is optional; but it's still a basic hook (not required).
  // If you prefer, we could remove it and compute inline.
  const filteredWorkouts = useMemo(() => {
    let list = workouts;

    if (workCat !== "All") {
      list = list.filter((x) => x.type === workCat);
    }
    if (workDate) {
      list = list.filter((x) => x.date === workDate);
    }
    if (workMinCal) {
      list = list.filter((x) => Number(x.caloriesBurned || 0) > Number(workMinCal));
    }

    // newest first
    return [...list].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [workouts, workCat, workDate, workMinCal]);

  const filteredMeals = useMemo(() => {
    let list = meals;

    // For meals, we treat "mealType" like a category for filtering
    if (mealCat !== "All") {
      list = list.filter((x) => x.mealType === mealCat.toLowerCase());
    }
    if (mealDate) {
      list = list.filter((x) => x.date === mealDate);
    }
    if (mealMinCal) {
      list = list.filter((x) => Number(x.calories || 0) > Number(mealMinCal));
    }

    return [...list].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [meals, mealCat, mealDate, mealMinCal]);

  async function deleteWorkout(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workouts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWorkouts(workouts.filter((x) => x._id !== id));
      } else {
        setError("Failed to delete workout");
      }
    } catch (err) {
      setError("Error deleting workout");
    }
  }

  async function deleteMeal(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/meals/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMeals(meals.filter((x) => x._id !== id));
      } else {
        setError("Failed to delete meal");
      }
    } catch (err) {
      setError("Error deleting meal");
    }
  }

  return (
    <div className="app">
      <h2 className="title">📋 History</h2>

      <div className="historySection">
        <h3>💪 Workouts</h3>
        <div className="filterBox">
          <h4 className="filterTitle">Filters</h4>
          <div className="filterRow">
            <div className="filterCol">
              <label className="label">Category</label>
              <select value={workCat} onChange={(e) => setWorkCat(e.target.value)}>
                <option>All</option>
                <option>Arms</option>
                <option>Chest</option>
                <option>Legs</option>
                <option>Back</option>
                <option>Cardio</option>
              </select>
            </div>
            <div className="filterCol">
              <label className="label">Date</label>
              <input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
              />
            </div>
            <div className="filterCol">
              <label className="label">Min Calories</label>
              <input
                type="number"
                value={workMinCal}
                onChange={(e) => setWorkMinCal(e.target.value)}
                placeholder="e.g. 100"
              />
            </div>
          </div>
        </div>

        <div className="listContainer">
          {filteredWorkouts.length === 0 ? (
            <div className="emptyState">
              <p>No workouts found. Start adding workouts to track your progress!</p>
            </div>
          ) : (
            filteredWorkouts.map((w) => (
              <div key={w.id} className="historyItem">
                <div className="itemHeader">
                  <h4>{w.name}</h4>
                  <span className="badge">{w.category}</span>
                </div>
                <div className="itemDetails">
                  <span className="detail">📅 {w.date}</span>
                  <span className="detail">⏱️ {w.duration} min</span>
                  <span className="detail">🔥 {w.calories} cal</span>
                </div>
                <button className="deleteBtn" onClick={() => deleteWorkout(w.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="historySection">
        <h3>🍎 Meals</h3>
        <div className="filterBox">
          <h4 className="filterTitle">Filters</h4>
          <div className="filterRow">
            <div className="filterCol">
              <label className="label">Meal Time</label>
              <select value={mealCat} onChange={(e) => setMealCat(e.target.value)}>
                <option>All</option>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>
            <div className="filterCol">
              <label className="label">Date</label>
              <input
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
              />
            </div>
            <div className="filterCol">
              <label className="label">Min Calories</label>
              <input
                type="number"
                value={mealMinCal}
                onChange={(e) => setMealMinCal(e.target.value)}
                placeholder="e.g. 500"
              />
            </div>
          </div>
        </div>

        <div className="listContainer">
          {filteredMeals.length === 0 ? (
            <div className="emptyState">
              <p>No meals found. Track your nutrition by adding meals!</p>
            </div>
          ) : (
            filteredMeals.map((m) => (
              <div key={m.id} className="historyItem">
                <div className="itemHeader">
                  <h4>{m.name}</h4>
                  <span className="badge">{m.time}</span>
                </div>
                <div className="itemDetails">
                  <span className="detail">📅 {m.date}</span>
                  <span className="detail">🔥 {m.calories} cal</span>
                </div>
                {m.notes && <div className="itemNotes">💬 {m.notes}</div>}
                <button className="deleteBtn" onClick={() => deleteMeal(m.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


