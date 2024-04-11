import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";

import { handleRegister } from "./controllers/register";
import { handleSignin } from "./controllers/signin";
import { handleProfile } from "./controllers/profile";
import { handleImage } from "./controllers/image";

const postgres = knex({
  client: "pg"
});

const app = express();
app.use(json());
app.use(cors());

app.get("/", (req, res) => {res.send("success")});
app.post("/signin", (req, res) => {handleSignin(req, res, postgres, bcrypt)});
app.post("/register", (req, res) => {handleRegister(req, res, postgres, bcrypt)});
app.get("/profile/:id", (req, res) => {handleProfile(req, res, postgres)});
app.put("/image", (req, res) => {handleImage(req, res, postgres)});

app.listen(3000, () => {console.log("app running on 3000")});