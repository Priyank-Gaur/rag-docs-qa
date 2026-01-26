function chunkText(text, chunkSize = 500, overlap = 100) {
  if (!text) return [];

  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.length > 50) { // Filter out tiny chunks
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

module.exports = { chunkText };
