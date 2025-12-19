import { Link, useNavigate } from "react-router-dom";

// Professional navigation bar
export default function NavBar({ user, setUser }) {
  const nav = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    nav("/");
  }

  return (
    <div className="topNav">
      <div className="links">
        <Link to="/dashboard" style={{ fontWeight: 700, fontSize: "16px" }}>
          💪 FitTracker
        </Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-workout">Add Workout</Link>
        <Link to="/add-meal">Add Meal</Link>
        <Link to="/history">History</Link>
        <Link to="/profile">Profile</Link>

        <div className="right">
          {user ? (
            <span className="mini">
              {user.email}{" "}
              <button 
                onClick={logout} 
                className="danger"
                style={{ marginLeft: "8px" }}
              >
                Logout
              </button>
            </span>
          ) : (
            <span className="mini">Not logged in</span>
          )}
        </div>
      </div>
    </div>
  );
}


