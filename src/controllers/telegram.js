const axios = require("axios");
const getResponse = require("../utils/chatCompletion");
const prisma = require("../../prisma/prisma-client");
const {
  getChannelByType,
  getUserChannel,
  createUserChannel,
} = require("../services/channel_details");
const { envKeys } = require("../../config");

const telegramController = {
  async registerWebhook(req, res) {
    try {
      const { apiToken } = req.body;
      if (!apiToken) {
        throw new Error("Token Required");
      }

      // TODO: Dynamic current_user id by auth
      const current_user = 1;
      const telegram_channel = await getChannelByType("telegram");
      let user_channel = await getUserChannel(
        current_user,
        telegram_channel.id
      );
      if (!user_channel) {
        user_channel = await createUserChannel(
          current_user,
          telegram_channel.id
        );
      }
      let telegramDetails = await prisma.telegram_channel_details.findUnique({
        where: { user_channel_id: user_channel.id },
      });
      if (!telegramDetails) {
        telegramDetails = await prisma.telegram_channel_details.create({
          data: {
            user_channel_id: user_channel.id,
            api_token: apiToken,
          },
        });
      } else {
        telegramDetails = await prisma.telegram_channel_details.update({
          where: {
            user_channel_id: user_channel.id,
          },
          data: {
            api_token: apiToken,
          },
        });
      }
      const result = await setWebhook(apiToken);
      if (result.status !== 200) throw new Error("Error setting webhook");
      res.json({
        status: true,
        message: "Webhook set successfully",
      });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  },

  async webhookHandler(req, res) {
    try {
      const uniqueUser = req.headers["x-telegram-bot-api-secret-token"];
      const chatId = req.body.message.chat.id;
      const text = req.body.message.text;
      if (uniqueUser && chatId && text) {
        const channelDetails = await prisma.telegram_channel_details.findUnique(
          {
            where: {
              user_channel_id: Number(uniqueUser),
            },
          }
        );
        if (channelDetails && channelDetails.api_token) {
          const botToken = channelDetails.api_token;
          const botResponse = await getResponse({ message: text });
          if (botResponse) {
            await sendMessage(chatId, botResponse, botToken);
          }
        }
        res.status(200).send("OK");
      }
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  },
};

async function setWebhook(apiToken) {
  const url = `https://api.telegram.org/bot${apiToken}/setWebhook?url=${envKeys.webhookBaseUrl}/telegram/webhook`;
  const result = await axios.post(url);
  const data = result.data;
  if (!data.ok) {
    throw new Error("Server responded with an error!");
  }
}

async function sendMessage(chatId, message, apiToken) {
  const options = {
    method: "POST",
    url: `https://api.telegram.org/bot${apiToken}/sendMessage`,
    headers: {
      accept: "application/json",
      "User-Agent":
        "Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)",
      "content-type": "application/json",
    },
    data: {
      text: message,
      chat_id: chatId,
    },
  };
  const response = await axios.request(options);
  const data = response.data;
  if (!data.ok) {
    throw new Error("Server responded with an error!");
  }
}

module.exports = telegramController;
