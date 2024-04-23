const handleSignin = (req, res, postgres, bcrypt) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json("signin failed");
  }

  postgres.select("email", "hash").from("login")
  .where("email", "=", email)
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);

    if (isValid) {
      return postgres.select("*").from("users")
      .where("email", "=", email)
      .then(user => {
        res.json(user[0]);
      })
      
      .catch(error => res.status(400).json("error getting user"));
    } else {
      res.status(400).json("error signing in")
    }
  })
  .catch(error => res.status(400).json("error signing in"))
};

module.exports = {
    handleSignin
};