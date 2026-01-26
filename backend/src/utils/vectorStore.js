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

function resetStore() {
  store.length = 0;
}

module.exports={
  addEmbedding,
  getAllEmbeddings,
  resetStore
};
