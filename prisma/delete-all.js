const prisma = require("./prisma-client");

async function deleteAllData() {
  try {
    await prisma.facebook_channel_details.deleteMany();

    await prisma.instagram_channel_details.deleteMany();

    await prisma.user_channels.deleteMany();

    await prisma.channels.deleteMany();

    await prisma.users.deleteMany();

    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllData();
