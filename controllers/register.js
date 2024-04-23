const handleRegister = (req, res, postgres, bcrypt) => {
  const saltRounds = 10;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("registration failed");
  }
  const hash = bcrypt.hashSync(password, saltRounds);
  postgres.transaction(trx => {
    trx.insert({hash, email})
    .into("login")
    .returning("email")
    .then(loginEmail => {
      return trx("users")
        .returning("*")
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
};

export default handleRegister;