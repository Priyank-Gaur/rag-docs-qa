require("dotenv").config();
const {readDocument}=require("./utils/readDoc");
const {chunkText}=require("./utils/chunker");
const {keywordSearch}=require("./utils/search");
const {generateEmbedding}=require("./utils/embeddings");
const {addEmbedding,getAllEmbeddings,resetStore}=require("./utils/vectorStore");
const {scrapeUrl}=require("./utils/scraper");
const {cosineSimilarity}=require("./utils/similarity");
const {rephraseAnswer}=require("./utils/answerGenerator");
const cors=require("cors");
const express=require("express");


const app=express();
app.use(express.json());
app.use(cors());

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

app.post("/ingest", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // 1. Reset the store
    resetStore();

    // 2. Scrape the URL
    // console.log(`Scraping ${url}...`);
    const text = await scrapeUrl(url);

    if (!text) {
      return res.status(400).json({ error: "No content found at URL" });
    }

    // 3. Chunk the text
    const chunks = chunkText(text);

    // 4. Generate embeddings and index
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      addEmbedding(chunk, embedding);
    }

    res.json({
      message: "Ingestion and indexing complete",
      chunks: chunks.length
    });

  } catch (error) {
    console.error("Ingestion failed:", error);
    res.status(500).json({ error: "Ingestion failed: " + error.message });
  }
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



app.get("/ask",async(req,res)=>{
  const {q}=req.query;

  if(!q){
    return res.json({
      answer:"Please provide a question.",
      sources:[]
    });
  }

  const queryEmbedding=await generateEmbedding(q);
  const stored=getAllEmbeddings();

  const scored=stored.map(item=>({
    text:item.text,
    score:cosineSimilarity(queryEmbedding,item.embedding)
  }));

  scored.sort((a,b)=>b.score-a.score);

  const SIMILARITY_THRESHOLD=0.25;
  const TOP_K=5;

  let topResults=scored.filter(
    item=>item.score>=SIMILARITY_THRESHOLD
  );

  if(topResults.length===0){
    topResults=scored.slice(0,TOP_K);
  }else{
    topResults=topResults.slice(0,TOP_K);
  }

  const uniqueChunks=[...new Set(topResults.map(r=>r.text))];

  const response=await rephraseAnswer(uniqueChunks,q);

  res.json(response);
});





app.listen(3000,()=>{
  console.log("Server running on port 3000");
});
