require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

const postgres = knex({
  client: "pg",
  connection: {
    connectionString: process.env.databaseUrl,
    ssl: {rejectUnauthorized: false},
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  },
});

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {res.send("success")});
app.post("/signin", (req, res) => {signin.handleSignin(req, res, postgres, bcrypt)});
app.post("/register", (req, res) => {register.handleRegister(req, res, postgres, bcrypt)});
app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, postgres)});
app.put("/image", (req, res) => {image.handleImage(req, res, postgres)});
app.post("/imageurl", (req, res) => { image.handleApiCall(req, res)});

app.listen(port, () => {console.log(`app running on port ${port}`)});