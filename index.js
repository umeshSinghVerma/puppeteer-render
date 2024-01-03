const express = require("express");
const cors = require('cors');
const { searchBook } = require("./searchBook");
const { getBook } = require("./getBook");
const app = express();
app.use(cors());

const puppeteer = require("puppeteer");
require("dotenv").config();
let browser;
async function LaunchBrowserProcess() {
  browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  console.log("browser process is initialized");
}
LaunchBrowserProcess();

const PORT = process.env.PORT || 4000;

app.get("/searchBook", (req, res) => {
  searchBook(req, res,browser);
});
app.get("/getBook", (req, res) => {
  getBook(req, res,browser);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
