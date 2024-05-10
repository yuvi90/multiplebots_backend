const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Working");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`> Ready on ${process.env.BASE_URL}:${process.env.PORT}`);
});
