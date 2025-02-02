const router = require("express").Router();
const lineController = require("../controllers/line");

router.post("/set-webhook", lineController.registerWebhook);
router.post("/webhook", lineController.webhookHandler);

module.exports = router;
