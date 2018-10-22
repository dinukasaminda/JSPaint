var express = require("express");
var bodyParser = require("body-parser");
var app = express(); // better instead
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

var canvasData = {
  drawLines: [],
  textList: []
};
app.post("/save", (req, res) => {
  canvasData = req.body;

  res.json({});
});
app.get("/restore", (req, res) => {
  res.json({ canvasData });
});

app.listen(3000);
