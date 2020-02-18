const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const morgan = require("morgan");
const routes = require("./routes");
let mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://harshitsood:harshit@11@cluster0-u69rg.gcp.mongodb.net/stripe", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoBD");
  })
  .on("error", err => {
    console.log(err);
  });

app.use(express.json());
app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/pages')));
app.use(routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Express is listening on port", port));
