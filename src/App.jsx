import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import NavBar from "./components/NavBar.jsx";
import LoginRequired from "./components/LoginRequired.jsx";

// pages
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AddWorkoutPage from "./pages/AddWorkoutPage.jsx";
import AddMealPage from "./pages/AddMealPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Main app component
export default function App() {
  // "Logged in user" - load from localStorage
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Main data arrays in state
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);

  // Steps data (super simple)
  const [stepsData, setStepsData] = useState([]);

  // Profile state
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "weight loss",
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.log("Error loading user");
      }
    }
    setLoadingUser(false);
  }, []);

  return (
    <div>
      {/* Nav bar shows on all pages. (beginner style) */}
      <NavBar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />

        {/* "Protected" pages: if not logged in, show LoginRequired */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage
                workouts={workouts}
                meals={meals}
                stepsData={stepsData}
                setStepsData={setStepsData}
              />
            ) : (
              <LoginRequired />
            )
          }
        />

        <Route
          path="/add-workout"
          element={
            user ? (
              <AddWorkoutPage workouts={workouts} setWorkouts={setWorkouts} />
            ) : (
              <LoginRequired />
            )
          }
        />

        <Route
          path="/add-meal"
          element={
            user ? <AddMealPage meals={meals} setMeals={setMeals} /> : <LoginRequired />
          }
        />

        <Route
          path="/history"
          element={
            user ? (
              <HistoryPage
                workouts={workouts}
                setWorkouts={setWorkouts}
                meals={meals}
                setMeals={setMeals}
              />
            ) : (
              <LoginRequired />
            )
          }
        />

        <Route
          path="/profile"
          element={user ? <ProfilePage profile={profile} setProfile={setProfile} /> : <LoginRequired />}
        />

        <Route
          path="*"
          element={
            <div className="app">
              <div className="box">
                <h3>Page not found</h3>
                <p className="muted">Try the Dashboard link.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}


