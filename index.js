const express = require("express");
const { searchBook } = require("./searchBook");
const { getBook } = require("./getBook");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/searchBook", (req, res) => {
  searchBook(req,res);
});
app.get("/getBook", (req, res) => {
  getBook(req,res);
});

app.get("/getBook", (req, res) => {
  getBook(req,res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
