const express = require("express");
const cors = require("cors");
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: '',
    user: '',
    password: '',
    database: '',
  },
});
const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "Dan",
      email: "dan@gmail.com",
      password: "dan",
      entries: 0,
      joined: new Date()
    },
    {
      id: "1234",
      name: "Sal",
      email: "sal@gmail.com",
      password: "sal",
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && 
      req.body.password === database.users[0].password) {
      res.json(database.users[0]);
    } else {
      res.status(400).json('error');
    }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  db('users').insert({
    email: email,
    name: name,
    joined: new Date()
  }).then(console.log)
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    return res.status(400).json("user not found")
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      user.entries++; 
      found = true;
      return res.json(user.entries);
    }
  })
  if (!found) {
    return res.status(400).json("user not found")
  }
})


app.listen(3000, () => {
  console.log("app running on 3000");
})