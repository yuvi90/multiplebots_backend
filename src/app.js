const express = require("express");
const { envKeys } = require("../config");

const app = express();

require("../config/passport-setup");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes"));

const port = envKeys.port || 8000;
app.listen(port, () => {
  console.log(`> Ready on ${envKeys.baseUrl}:${envKeys.port}`);
});
