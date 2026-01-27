const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function askQuestion(question){
  const res=await fetch(
    `${API_BASE_URL}/ask?q=${encodeURIComponent(question)}`
  );
  return res.json();
}

export async function ingestUrl(url) {
  const res = await fetch(`${API_BASE_URL}/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to ingest URL");
  }

  return res.json();
}