const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'the id does not exist'})
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const data = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0  
  }

  repositories.push(data);

  return response.json(data)
});

app.put("/repositories/:id", checkId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repIndex = repositories.findIndex(r => r.id === id);
  const folder = repositories.find(r => r.id === id);

  const data = {...folder, title, url, techs};

  repositories[repIndex] = data;

  return response.json(data);
});

app.delete("/repositories/:id", checkId, (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(r => r.id === id);

  repositories.splice(repIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", checkId, (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(r => r.id === id);
  const rep = repositories.find(r => r.id === id);

  const data = { ...rep, likes: rep.likes += 1 };

  repositories[repIndex] = data;

  return response.json(data);
});

module.exports = app;
