const express = require("express");
const cors = require("cors");
const knex = require('knex');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const postgres = knex({
  client: 'pg'
});
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body
  postgres.select('email', 'hash').from('login')
  .where('email', '=', email)
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if (isValid) {
      return postgres.select('*').from('users')
      .where('email', '=', email)
      .then(user => {
        res.json(user[0]);
      })
      .catch(error => res.status(400).json('error getting user'));
    } else {
      res.status(400).json('error signing in')
    }
  })
  .catch(error => res.status(400).json('error signing in'))
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  postgres.transaction(trx => {
    trx.insert({hash, email})
    .into("login")
    .returning("email")
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0])
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(error => res.status(400).json("registration failed"))


});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  postgres.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('User not found')
      }      
    })
    .catch(error => res.status(400).json("error getting user"));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  postgres("users").where("id", "=", id)
  .increment("entries", 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(error => res.status(400).json("entries not found"))
});


app.listen(3000, () => {
  console.log("app running on 3000");
})