import SimpleChart from "../components/SimpleChart.jsx";
import "./ProgressPage.css";

// Progress Page (pure UI mock)
export default function ProgressPage() {
  // Dummy numbers (static)
  const weekSteps = [3000, 4500, 6500, 8000, 7200, 9000, 6100];

  // Fake goal tracking
  const goal = 12000; // monthly calories burned goal (dummy)
  const current = 7300; // dummy progress
  const percent = Math.min(100, Math.round((current / goal) * 100));

  // Convert steps into "bar heights" (simple)
  const bars = weekSteps.map((x) => Math.round(x / 150));

  return (
    <div className="app">
      <h2 className="title">📈 Your Progress</h2>

      <div className="box">
        <h3>🏃 Weekly Steps</h3>
        <div className="stepCardsGrid">
          {weekSteps.map((s, i) => (
            <div key={i} className="stepCard">
              <div className="stepDay">Day {i + 1}</div>
              <div className="stepCount">{(s / 1000).toFixed(1)}k</div>
              <div className="stepLabel">steps</div>
            </div>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>📊 Activity Chart</h3>
        <p className="muted">Your weekly activity visualization</p>
        <SimpleChart values={bars} colorType="green" />
      </div>

      <div className="box">
        <h3>🎯 Monthly Goal</h3>
        <div className="goalSection">
          <div className="goalInfo">
            <div className="goalLabel">Calories Burned Target</div>
            <div className="goalValue">{current} / {goal}</div>
          </div>
          
          <div className="progressContainer">
            <div className="progressBarNew">
              <div className="progressFillNew" style={{ width: percent + "%" }} />
            </div>
            <div className="progressPercent">{percent}% Complete</div>
          </div>

          <div className="progressStats">
            <div className="statBox">
              <span className="statLabel">Remaining</span>
              <span className="statValue">{goal - current}</span>
            </div>
            <div className="statBox">
              <span className="statLabel">Achieved</span>
              <span className="statValue">{current}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


