import { useState, useEffect } from "react";
import api from "./api";

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState(
    "Testing connection...",
  );
  const [dbTime, setDbTime] = useState("");
  const [testToken, setTestToken] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await api.get("/api/test-connection");
        if (response.data.status === "success") {
          setConnectionStatus("Connected Successfully!");
          setDbTime(response.data.timestamp);
          setTestToken(response.data.generatedToken);
        }
      } catch (err) {
        console.error("Connection error:", err);
        setConnectionStatus("Connection Failed!");
        setError(err.message || "Failed to contact server.");
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div
      style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}
    >
      <h1>Connection Setup Guide (Part 1)</h1>
      <div
        style={{
          margin: "20px auto",
          padding: "20px",
          maxWidth: "600px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>System Status</h2>
        <p>
          <strong>Status:</strong> {connectionStatus}
        </p>

        {dbTime && (
          <p>
            <strong>PostgreSQL DB Time:</strong> {dbTime}
          </p>
        )}

        {testToken && (
          <p>
            <strong>Generated Token (getUniqIdValue):</strong>{" "}
            <code>{testToken}</code>
          </p>
        )}

        {error && (
          <p style={{ color: "red" }}>
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
