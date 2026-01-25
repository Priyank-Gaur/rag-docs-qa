function generateAnswer(results){
  if(results.length===0){
    return {
      answer:"I could not find this information in the provided documentation.",
      sources:[]
    };
  }

  const answerText=results.map(r=>r.text).join("\n\n");

  return {
    answer:answerText,
    sources:results.map(r=>r.text)
  };
}

module.exports={generateAnswer};
