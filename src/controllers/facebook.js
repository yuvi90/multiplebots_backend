const axios = require("axios");
const { envKeys } = require("../../config");

const facebookController = {
  webHookSubscribe(req, res) {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === envKeys.fbWebhookVerifyToken) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  },

  webhookEvents(req, res) {
    console.log(req.body.entry[0].messaging[0].message.text);
    res.end();
  },

  async testRoute(req, res) {
    subscribeWebhook();
    res.end();
  },
};

async function getList() {
  const userAccessToken = envKeys.fbUserAccessToken;
  const userId = envKeys.fbUserId;
  const url = `https://graph.facebook.com/${userId}/accounts?access_token=${userAccessToken}`;
  const result = await axios.get(url);
  console.log(result.data);
}

async function subscribeWebhook() {
  const pageAccessToken = envKeys.fbPageAccessToken;
  const pageId = envKeys.fbPageId;
  // const url = `https://graph.facebook.com/${pageId}/subscribed_apps?subscribed_fields=messages&access_token=${pageAccessToken}`;
  const url = `https://graph.facebook.com/17841413664932566/subscribed_apps?subscribed_fields=messages&access_token=EAAHHbJqvJjMBO8hdjsD3NBeA4tYJY33u6oZAD3c1oeUZAhtoC08645GWHkLKCxUfyBpLovnWZAP9hCQAcZBKhadG11PaP5tF0H4LCMT7htkeORdJCQgSFcawUnHL2ljRxjuM6aLqJkRZA8qRFWN3mwyEEJ8ketMH523R6UFAgl9Ir7x2hPj1yvWrtOG6hIzSJjwkh7yOZBjhbmox1zU6pj1I0PCQf3CcZA78X9TqrMZD`;
  const result = await axios.post(url);
  console.dir(result.data, { depth: null });
}

module.exports = facebookController;
