import { Link } from "react-router-dom";

// Tiny helper component to keep things simple
export default function LoginRequired() {
  return (
    <div className="app">
      <div className="box" style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>Access Required</h3>
        <p className="muted" style={{ marginBottom: "24px" }}>
          Please log in to access this page.
        </p>
        <Link 
          to="/" 
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}


