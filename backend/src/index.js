const {readDocument}=require("./utils/readDoc");
const {chunkText}=require("./utils/chunker");


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


app.listen(3000,()=>{
  console.log("Server running on port 3000");
});
