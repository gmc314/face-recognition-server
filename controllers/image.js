const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: ""
 });
 
const handleImage = (req, res, postgres) => {
  const { id } = req.body;
  postgres("users").where("id", "=", id)
  .increment("entries", 1)
  .returning("entries")
  .then(entries => {
    res.json(entries[0].entries)
  })
  .catch(error => res.status(400).json("entries not found"))
};
const handleApiCall = (req, res) => {
  app.models.predict('face-detection', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(error => res.status(400).json("cannot get API call"))
}

module.exports = {
  handleImage,
  handleApiCall
};