const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let requisicoes = 0;


// //localhost:6060/users

// SOME DATA TO START
projects.push({
    id: 0,
    title: "Interface",
    tasks: ["Fazer Menu"]
});

//MIDDLEWARE

function checkProjectId(req, res, next) {

  const { id } = req.params;

  const project = projects.find(proj => proj.id == id);

  req.params.project = project;

  if (!project) {
      return res.status(400).json({ error: "No project found" });
  }

  return next();
}

function checkProjectTaskId(req, res, next) {
  
  const { project, taskIndex } = req.params;

  const taskId = project.tasks[taskIndex];

  if(!taskId) {
      return res.status(400).json({ error: "Não foi possivel encontrar o task no projeto" });
  }

  return next();
}


server.use((req, res, next) => {
  console.log(++requisicoes);

  return next();
});





// Add project
server.post('/projects', (req, res) => {
  const {id,title} = req.body;

  projects.push({
    id,
    title,
    tasks: []
  })

  return res.json(projects)

})

// Ver projects
server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.get('/projects/:id', checkProjectId, (req, res) => {
  const {id} = req.params;
  
  return res.json(projects[id]);
})

// Alterar Project
server.put('/projects/:id', checkProjectId, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  // Find project
  const project = projects.find(proj => proj.id == id);

  project.title = title;

  // Retorno
  return res.send(project);
})

// Delete project
server.delete('/projects/:id', checkProjectId, (req, res) => {
  const {id} = req.params;

  const projDelete = projects.findIndex(proj => proj.id == id);

  projects.splice(projDelete, 1);

  return res.send(projects);
})

// Add Task
server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  const projTaskAdd = projects.find(proj => proj.id == id);

  projTaskAdd.tasks.push(title);

  return res.json(projTaskAdd);
})

server.listen(6060);