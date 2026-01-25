import { useState } from "react";
import { askQuestion } from "./api";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(e) {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setSources([]);
    setError("");

    try {
      const data = await askQuestion(question);
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err) {
      console.error("Failed to fetch answer:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1>DocuMind AI</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "1.2rem", marginTop: "0.5rem" }}>
          Intelligent documentation analysis and Q&A
        </p>
      </header>

      <main>
        <section className="glass-card">
          <form onSubmit={handleAsk}>
            <div className="input-group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the documentation..."
                disabled={loading}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <div className="loading-spinner" /> : "Ask AI"}
              </button>
            </div>
          </form>
          
          {error && (
             <div style={{ marginTop: "1.5rem", color: "var(--color-accent)", textAlign: "center" }}>
               {error}
             </div>
          )}
        </section>

        {answer && (
          <section className="answer-section">
            <div className="glass-card answer-card">
              <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Answer</h2>
              <div className="answer-content">{answer}</div>
              
              {sources.length > 0 && (
                <div className="sources-section">
                  <h3 style={{ fontSize: "1.1rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    Sources
                  </h3>
                  <ul className="sources-list">
                    {sources.map((source, index) => (
                      <li key={index} className="source-item">
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
