import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

// Login + Register page
export default function LoginPage({ setUser }) {
  const nav = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" 
        ? { email, password }
        : { username, email, password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setLoading(false);
      nav("/dashboard");
    } catch (err) {
      setError("Connection error. Make sure backend is running on http://localhost:5000");
      setLoading(false);
    }
  }

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="loginHeader">
          <h1 className="loginTitle">💪 FitTracker</h1>
          <p className="loginSubtitle">Your personal fitness companion</p>
        </div>

        <div className="modeSwitcher">
          <button
            className={`modeButton ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`modeButton ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {error && <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={submit} className="loginForm">
          {mode === "register" && (
            <div className="formGroup">
              <label className="label">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Choose a username"
                required
              />
            </div>
          )}

          <div className="formGroup">
            <label className="label">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="formGroup">
            <label className="label">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submitButton" disabled={loading}>
            {loading ? "Loading..." : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </form>

        <p className="helpText">
          {mode === "login"
            ? "New to FitTracker? Register above to get started!"
            : "Already have an account? Switch to Login above."}
        </p>
      </div>

      <div className="loginFooter">
        <p>🚀 Start tracking your fitness journey today!</p>
      </div>
    </div>
  );
}


