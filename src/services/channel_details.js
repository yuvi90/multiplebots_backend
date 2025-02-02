const prisma = require("../../prisma/prisma-client");

async function getChannelByType(channelType) {
  const channel = await prisma.channels.findUnique({
    where: {
      type: channelType,
    },
  });
  return channel;
}

async function getUserChannel(userId, channelId) {
  const userChannel = await prisma.user_channels.findFirst({
    where: {
      user_id: userId,
      channel_id: channelId,
    },
  });
  return userChannel;
}

async function createUserChannel(userId, channelId) {
  const user_channel = await prisma.user_channels.create({
    data: {
      user_id: userId,
      channel_id: channelId,
    },
  });
  return user_channel;
}

module.exports = {
  getChannelByType,
  getUserChannel,
  createUserChannel,
};
