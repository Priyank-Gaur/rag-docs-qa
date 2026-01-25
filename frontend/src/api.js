export async function askQuestion(question){
  const res=await fetch(
    `http://localhost:3000/ask?q=${encodeURIComponent(question)}`
  );
  return res.json();
}