const {readDocument}=require("./utils/readDoc");
const {chunkText}=require("./utils/chunker");
const {keywordSearch}=require("./utils/search");
const {generateEmbedding}=require("./utils/embeddings");
const {addEmbedding,getAllEmbeddings}=require("./utils/vectorStore");
const {cosineSimilarity}=require("./utils/similarity");

const express=require("express");

const app=express();
app.use(express.json());

app.get("/doc",(req,res)=>{
  const text=readDocument();
  res.send(text);
});

app.get("/chunks",(req,res)=>{
  const text=readDocument();
  const chunks=chunkText(text);
  res.json(chunks);
});

app.get("/search",(req,res)=>{
  const {q}=req.query;
  const text=readDocument();
  const chunks=chunkText(text);
  const results=keywordSearch(chunks,q);
  res.json(results);
});

app.get("/embed-test",async(req,res)=>{
  const vec=await generateEmbedding("authentication and login");
  res.json({
    length:vec.length,
    sample:vec.slice(0,5)
  });
});

app.get("/index-doc",async(req,res)=>{
  const text=readDocument();
  const chunks=chunkText(text);

  for(const chunk of chunks){
    const embedding=await generateEmbedding(chunk);
    addEmbedding(chunk,embedding);
  }

  res.json({
    message:"Document indexed",
    chunks:chunks.length
  });
});


app.get("/semantic-search",async(req,res)=>{
  const {q}=req.query;
  if(!q){
    return res.json([]);
  }

  const queryEmbedding=await generateEmbedding(q);
  const stored=getAllEmbeddings();

  const scored=stored.map(item=>({
    text:item.text,
    score:cosineSimilarity(queryEmbedding,item.embedding)
  }));

  scored.sort((a,b)=>b.score-a.score);

  res.json(scored.slice(0,3));
});





app.listen(3000,()=>{
  console.log("Server running on port 3000");
});
