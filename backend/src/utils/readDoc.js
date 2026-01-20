const fs=require("fs");
const path=require("path");

function readDocument(){
  const filePath=path.join(__dirname,"../../data/sample-doc.txt");
  const text=fs.readFileSync(filePath,"utf-8");
  return text;
}

module.exports={readDocument};
