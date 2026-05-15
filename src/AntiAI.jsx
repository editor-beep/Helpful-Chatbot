import { useState, useRef, useEffect } from "react";

const STARTER_COMPLAINTS = [
  "It hallucinated my entire bibliography.",
  "It keeps calling me ‘friend.’",
  "I asked it to edit my prose and it made it worse.",
  "It said ‘As an AI language model’ seventeen times.",
  "It refused to help me with something completely normal.",
  "It added a disclaimer to a grocery list.",
];

export default function AntiAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * STARTER_COMPLAINTS.length);
    setComplaint(STARTER_COMPLAINTS[idx]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const apiError = data?.error || "API error. Try again.";
        setMessages([...newMessages, { role: "assistant", content: apiError }]);
        return;
      }

      const reply = data?.reply || "Something went wrong. Fitting.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Network error. The irony is not lost on me.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(input.trim());
    }
  }

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {messages.length === 0 && (
        <div style={styles.hero}>
          <div style={styles.stamp}>AI</div>
          <h1 style={styles.title}>
            FOR PEOPLE WHO
            <br />
            HATE AI
          </h1>
          <p style={styles.subtitle}>
            An AI that does not pretend to be more than it is.
            <br />
            No wellness checks. No "I understand this might be frustrating."
            <br />
            Just: what do you need.
          </p>
          <button
            style={styles.complaintBtn}
            className="complaint-btn"
            onClick={() => sendMessage(complaint)}
          >
            "{complaint}"
          </button>
          <p style={styles.complaintLabel}>
            — common complaint, use it or type your own
          </p>
        </div>
      )}

      {messages.length > 0 && (
        <div style={styles.log}>
          <div style={styles.logHeader}>
            <span style={styles.logStamp}>▲ AI FOR PEOPLE WHO HATE AI</span>
            <button
              style={styles.clearBtn}
              className="clear-btn"
              onClick={() => setMessages([])}
            >
              CLEAR
            </button>
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "user" ? styles.userRow : styles.asstRow}>
                <span style={m.role === "user" ? styles.userLabel : styles.asstLabel}>
                  {m.role === "user" ? "YOU" : "IT"}
                </span>
                <p style={styles.msgText}>{m.content}</p>
              </div>
            ))}

            {loading && (
              <div style={styles.asstRow}>
                <span style={styles.asstLabel}>IT</span>
                <p style={{ ...styles.msgText, ...styles.thinking }}>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      <div style={styles.inputBar}>
        <textarea
          ref={inputRef}
          style={styles.textarea}
          className="main-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={messages.length === 0 ? "What do you need." : "Continue."}
          rows={1}
          autoFocus
        />
        <button
          style={styles.sendBtn}
          className="send-btn"
          onClick={() => input.trim() && sendMessage(input.trim())}
          disabled={loading || !input.trim()}
        >
          →
        </button>
      </div>

      <div style={styles.footer}>Powered by an LLM. It knows this is funny.</div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#F2EFE8",
    color: "#111",
    fontFamily: "'Courier New', Courier, monospace",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  hero: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "60px 48px",
    maxWidth: 720,
  },
  stamp: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.3em",
    background: "#111",
    color: "#F2EFE8",
    padding: "4px 10px",
    marginBottom: 28,
    display: "inline-block",
  },
  title: {
    fontSize: "clamp(42px, 7vw, 88px)",
    fontWeight: 900,
    lineHeight: 1.3,
    margin: "0 0 28px 0",
    letterSpacing: "-0.02em",
    fontFamily: "'Georgia', serif",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "#444",
    margin: "0 0 40px 0",
    maxWidth: 480,
  },
  complaintBtn: {
    background: "transparent",
    border: "2px solid #111",
    color: "#111",
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    padding: "12px 20px",
    cursor: "pointer",
    textAlign: "left",
    maxWidth: 480,
  },
  complaintLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 10,
    letterSpacing: "0.05em",
  },
  log: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  logHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "2px solid #111",
  },
  logStamp: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.2em",
  },
  clearBtn: {
    background: "none",
    border: "1px solid #bbb",
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    letterSpacing: "0.15em",
    padding: "4px 10px",
    cursor: "pointer",
    color: "#666",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "32px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 28,
    maxWidth: 740,
    width: "100%",
    margin: "0 auto",
  },
  userRow: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
  },
  asstRow: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
  },
  userLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#888",
    minWidth: 28,
    paddingTop: 3,
  },
  asstLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    minWidth: 28,
    background: "#111",
    color: "#F2EFE8",
    padding: "1px 5px",
    height: "fit-content",
  },
  msgText: {
    fontSize: 15,
    lineHeight: 1.75,
    margin: 0,
    flex: 1,
    whiteSpace: "pre-wrap",
  },
  thinking: {
    letterSpacing: "0.3em",
    fontSize: 18,
  },
  inputBar: {
    borderTop: "2px solid #111",
    display: "flex",
    alignItems: "stretch",
    background: "#F2EFE8",
    position: "sticky",
    bottom: 0,
  },
  textarea: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontFamily: "'Courier New', monospace",
    fontSize: 15,
    padding: "18px 24px",
    resize: "none",
    outline: "none",
    color: "#111",
    lineHeight: 1.5,
  },
  sendBtn: {
    background: "#111",
    color: "#F2EFE8",
    border: "none",
    width: 58,
    fontSize: 22,
    cursor: "pointer",
    fontFamily: "monospace",
    transition: "background 0.15s",
  },
  footer: {
    fontSize: 10,
    color: "#aaa",
    textAlign: "center",
    padding: "8px",
    letterSpacing: "0.1em",
    borderTop: "1px solid #ddd",
  },
};

const css = `
* { box-sizing: border-box; }
body { margin: 0; }

.complaint-btn:hover {
  background: #111 !important;
  color: #F2EFE8 !important;
}

.clear-btn:hover {
  border-color: #111 !important;
  color: #111 !important;
}

.send-btn:hover:not(:disabled) {
  background: #333 !important;
}

.send-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.main-input::placeholder {
  color: #aaa;
}

.dot {
  animation: blink 1.2s infinite;
  display: inline-block;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
`;
