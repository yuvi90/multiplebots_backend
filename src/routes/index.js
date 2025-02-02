const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("home");
});
router.use("/facebook", require("./facebook"));
router.use("/telegram", require("./telegram"));
router.use("/line", require("./line"));
router.use("/auth", require("./auth"));

module.exports = router;
