const axios = require("axios");
const getResponse = require("../utils/chatCompletion");
const prisma = require("../../prisma/prisma-client");
const {
  getChannelByType,
  getUserChannel,
  createUserChannel,
} = require("../services/channel_details");

const lineController = {
  async registerWebhook(req, res) {
    try {
      const { channelId, channelAccessToken, channelSecret } = req.body;
      if (!channelId || !channelAccessToken || !channelSecret) {
        throw new Error("Channel Id, Access Token and Secret are required");
      }
      // TODO: Dynamic current_user id by auth
      const current_user = 1;
      const line_channel = await getChannelByType("line");
      let user_channel = await getUserChannel(current_user, line_channel.id);
      if (!user_channel) {
        user_channel = await createUserChannel(current_user, line_channel.id);
      }

      let lineDetails = await prisma.line_channel_details.findUnique({
        where: { user_channel_id: user_channel.id },
      });
      if (!lineDetails) {
        lineDetails = await prisma.line_channel_details.create({
          data: {
            user_channel_id: user_channel.id,
            channel_id: channelId,
            channel_access_token: channelAccessToken,
            channel_secret: channelSecret,
          },
        });
      } else {
        lineDetails = await prisma.line_channel_details.update({
          where: { user_channel_id: user_channel.id },
          data: {
            channel_id: channelId,
            channel_access_token: channelAccessToken,
            channel_secret: channelSecret,
          },
        });
      }
      const result = await setWebhook(channelAccessToken);
      if (result.status !== 200) throw new Error("Error setting webhook");
      res.json({
        status: true,
        message: "Webhook set successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  async webhookHandler(req, res) {
    try {
      console.log(req.body);
      const channelId = req.body.channel.id;
      const { replyToken } = req.body.events[0];
      const { text } = req.body.events[0].message;
      if (channelId && replyToken && text) {
        const lineDetails = await prisma.line_channel_details.findUnique({
          where: { channel_id: channelId },
        });
        if (lineDetails) {
          let botResponse = await getResponse({ message: text });
          if (botResponse) {
            await sendMessage(
              replyToken,
              botResponse,
              lineDetails.channel_access_token
            );
          }
        }
        res.status(200).send("OK");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

async function sendMessage(replyToken, message, channelAccessToken) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
  };
  const data = {
    replyToken,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };
  try {
    await axios.post("https://api.line.me/v2/bot/message/reply", data, config);
  } catch (error) {
    throw new Error("Error sending message: " + error.message);
  }
}

async function setWebhook(channelAccessToken) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
  };
  const data = {
    endpoint: "https://fairly-fleet-cockatoo.ngrok-free.app/line/webhook",
  };
  try {
    await axios.put(
      "https://api.line.me/v2/bot/channel/webhook/endpoint",
      data,
      config
    );
  } catch (error) {
    throw new Error("Error setting webhook: " + error.message);
  }
}

module.exports = lineController;
