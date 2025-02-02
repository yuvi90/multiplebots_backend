const prisma = require("./prisma-client");

async function seed() {
  const channelTypes = [
    "facebook_messenger",
    "instagram",
    "whatsapp",
    "telegram",
    "line",
    "slack",
    "google_business",
    "webchat",
  ];

  await Promise.all(
    channelTypes.map((channel) => {
      return prisma.channels.create({
        data: {
          type: channel,
        },
      });
    })
  );

  const user1 = await prisma.users.create({
    data: {
      email: "user1@example.com",
      password: "password123",
    },
  });

  const user2 = await prisma.users.create({
    data: {
      email: "user2@example.com",
      password: "password456",
    },
  });

  const facebook_messenger = await prisma.channels.findUnique({
    where: {
      type: "facebook_messenger",
    },
  });
  const instagram = await prisma.channels.findUnique({
    where: {
      type: "instagram",
    },
  });

  await prisma.user_channels.createMany({
    data: [
      {
        user_id: user1.id,
        channel_id: facebook_messenger.id,
      },
      { user_id: user1.id, channel_id: instagram.id },
      {
        user_id: user2.id,
        channel_id: facebook_messenger.id,
      },
    ],
  });

  const user_facebook_channel_1 = await prisma.user_channels.findFirst({
    where: {
      user_id: user1.id,
      channel_id: facebook_messenger.id,
    },
  });
  const user_facebook_channel_2 = await prisma.user_channels.findFirst({
    where: {
      user_id: user2.id,
      channel_id: facebook_messenger.id,
    },
  });

  if (user_facebook_channel_1) {
    await prisma.facebook_channel_details.create({
      data: {
        user_channel_id: user_facebook_channel_1.id,
        access_token: "access_token_1",
        page_id: "page_id_1",
        page_access_token: "page_access_token_1",
      },
    });
  }
  if (user_facebook_channel_2) {
    await prisma.facebook_channel_details.create({
      data: {
        user_channel_id: user_facebook_channel_2.id,
        access_token: "access_token_2",
        page_id: "page_id_2",
        page_access_token: "page_access_token_2",
      },
    });
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
