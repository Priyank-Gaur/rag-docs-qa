import { useState } from "react";
import { askQuestion, ingestUrl } from "./api";
import ReactMarkdown from 'react-markdown';
import { 
  Search, 
  Database, 
  MessageSquare, 
  Loader2, 
  Sparkles, 
  ExternalLink, 
  AlertCircle 
} from "lucide-react";

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
    <>
    <div className="container">
      <header className="header">
        <h1>DocuMind AI</h1>
        <p>Intelligent documentation analysis and Q&A powered by Groq</p>
      </header>

      <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Ingestion Section */}
        <section className="glass-panel">
          <div className="section-title">
            <Database size={20} />
            <span>Add Documentation</span>
          </div>
          
          <form onSubmit={handleIngest}>
            <div className="input-wrapper">
              <input
                className="input-field"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter documentation URL..."
                disabled={ingesting || loading}
              />
              <button 
                type="submit" 
                className="btn-icon" 
                disabled={ingesting || loading || !url}
                title="Load URL"
              >
                {ingesting ? <Loader2 className="spinner" /> : <Sparkles size={20} />}
              </button>
            </div>
            {ingestStatus && (
              <div className="status-msg status-success">
                 <Sparkles size={16} /> {ingestStatus}
              </div>
            )}
            {error && ingestStatus === "" && !answer && (
               <div className="status-msg status-error">
                  <AlertCircle size={16} /> {error}
               </div>
            )}
          </form>
        </section>

        {/* Q&A Section */}
        <section className="glass-panel">
        <div className="section-title">
            <MessageSquare size={20} />
            <span>Ask Questions</span>
          </div>
          <form onSubmit={handleAsk}>
            <div className="input-wrapper">
              <input
                className="input-field"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the documentation..."
                disabled={loading || ingesting}
              />
              <button 
                type="submit" 
                className="btn-icon" 
                disabled={loading || ingesting || !question}
                title="Ask AI"
              >
                {loading ? <Loader2 className="spinner" /> : <Search size={20} />}
              </button>
            </div>
          </form>
          
          {error && answer === "" && !ingestStatus && (
             <div className="status-msg status-error">
               <AlertCircle size={16} /> {error}
             </div>
          )}
        </section>

        {answer && (
          <section className="answer-container">
            <div className="answer-box">
              <div className="section-title">
                 <Sparkles size={20} className="text-primary" />
                 <span>Answer</span>
              </div>
              
              <div className="markdown-content">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
              
              {sources.length > 0 && (
                <div className="sources-grid">
                    {sources.map((source, index) => (
                      <div key={index} className="source-pill">
                        <ExternalLink size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{source.substring(0, 150)}...</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Priyank Gaur. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
