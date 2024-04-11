const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const postgres = knex({
  client: "pg"
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {res.send("success")});
app.post("/signin", (req, res) => {signin.handleSignin(req, res, postgres, bcrypt)});
app.post("/register", (req, res) => {register.handleRegister(req, res, postgres, bcrypt)});
app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, postgres)});
app.put("/image", (req, res) => {image.handleImage(req, res, postgres)});

app.listen(3000, () => {console.log("app running on 3000")});