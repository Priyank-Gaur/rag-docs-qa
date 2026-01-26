import { useState } from "react";
import { askQuestion, ingestUrl } from "./api";

function App() {
  const [url, setUrl] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleIngest(e) {
    e.preventDefault();
    if (!url) return;

    setIngesting(true);
    setIngestStatus("Scraping and indexing...");
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const data = await ingestUrl(url);
      setIngestStatus(`Success! indexed ${data.chunks} chunks.`);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setIngestStatus("");
    } finally {
      setIngesting(false);
    }
  }

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
        {/* Ingestion Section */}
        <section className="glass-card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>1. Add Documentation</h2>
          <form onSubmit={handleIngest}>
            <div className="input-group">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter documentation URL..."
                disabled={ingesting || loading}
              />
              <button type="submit" className="btn-primary" disabled={ingesting || loading}>
                {ingesting ? <div className="loading-spinner" /> : "Load URL"}
              </button>
            </div>
            {ingestStatus && (
               <div style={{ marginTop: "1rem", color: "var(--color-secondary)" }}>
                 {ingestStatus}
               </div>
            )}
          </form>
        </section>

        {/* Q&A Section */}
        <section className="glass-card">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>2. Ask Questions</h2>
          <form onSubmit={handleAsk}>
            <div className="input-group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the documentation..."
                disabled={loading || ingesting}
              />
              <button type="submit" className="btn-primary" disabled={loading || ingesting}>
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
