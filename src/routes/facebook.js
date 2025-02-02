const facebookController = require("../controllers/facebook");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Facebook Route");
});
router.get("/webhook", facebookController.webHookSubscribe);
router.post("/webhook", facebookController.webhookEvents);
router.get("/test", facebookController.testRoute);

module.exports = router;
