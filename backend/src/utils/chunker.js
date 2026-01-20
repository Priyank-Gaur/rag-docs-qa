function chunkText(text){
  return text
    .split("\n\n")
    .map(chunk=>chunk.trim())
    .filter(Boolean);
}

module.exports={chunkText};
