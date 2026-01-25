function rephraseAnswer(chunks,question){
  if(chunks.length===0){
    return {
      answer:"I could not find this information in the provided documentation.",
      sources:[]
    };
  }

  const mainChunk=chunks[0];

  let answer=`Based on the documentation:\n\n${mainChunk}`;

  return {
    answer,
    sources:chunks
  };
}

module.exports={rephraseAnswer};
