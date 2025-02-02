require("dotenv").config();

const envKeys = {
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  webhookBaseUrl: process.env.WEBHOOK_BASE_URL,
  dbUrl: process.env.DATABASE_URL,
  fbAppId: process.env.FACEBOOK_APP_ID,
  fbAppSecret: process.env.FACEBOOK_APP_SECRET,
  fbWebhookVerifyToken: process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN,
  cookieSecret: process.env.COOKIE_SECRET,
  openAIKey: process.env.OPENAI_KEY,

  // Temporary Config
  fbUserId: process.env.FACEBOOK_USER_ID,
  fbUserAccessToken: process.env.FACEBOOK_USER_ACCESS_TOKEN,
  fbPageId: process.env.FACEBOOK_PAGE_ID,
  fbPageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
};

module.exports = { envKeys };
