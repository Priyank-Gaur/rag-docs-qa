const store=[];

function addEmbedding(text,embedding){
  store.push({
    text,
    embedding
  });
}

function getAllEmbeddings(){
  return store;
}

module.exports={
  addEmbedding,
  getAllEmbeddings
};
