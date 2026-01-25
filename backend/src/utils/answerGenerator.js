function generateAnswer(results){
  if(results.length===0){
    return {
      answer:"I could not find this information in the provided documentation.",
      sources:[]
    };
  }

  const uniqueTexts=[...new Set(results.map(r=>r.text))];

  return {
    answer:uniqueTexts.join("\n\n"),
    sources:uniqueTexts
  };
}

module.exports={generateAnswer};
