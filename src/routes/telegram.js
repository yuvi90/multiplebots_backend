const telegramController = require("../controllers/telegram");

const router = require("express").Router();
router.post("/set-webhook", telegramController.registerWebhook);
router.post("/webhook", telegramController.webhookHandler);

module.exports = router;
