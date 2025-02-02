-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "channels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_channels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL,
    CONSTRAINT "user_channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_channels_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "facebook_channel_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_channel_id" INTEGER NOT NULL,
    "profile_id" TEXT,
    "full_name" TEXT,
    "access_token" TEXT,
    "page_id" TEXT,
    "page_access_token" TEXT,
    CONSTRAINT "facebook_channel_details_user_channel_id_fkey" FOREIGN KEY ("user_channel_id") REFERENCES "user_channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "instagram_channel_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_channel_id" INTEGER NOT NULL,
    "profile_id" TEXT,
    "full_name" TEXT,
    "access_token" TEXT,
    "insta_user_id" TEXT,
    CONSTRAINT "instagram_channel_details_user_channel_id_fkey" FOREIGN KEY ("user_channel_id") REFERENCES "user_channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "telegram_channel_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_channel_id" INTEGER NOT NULL,
    "api_token" TEXT,
    CONSTRAINT "telegram_channel_details_user_channel_id_fkey" FOREIGN KEY ("user_channel_id") REFERENCES "user_channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "channels_type_key" ON "channels"("type");

-- CreateIndex
CREATE UNIQUE INDEX "user_channels_user_id_channel_id_key" ON "user_channels"("user_id", "channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_channel_details_user_channel_id_key" ON "facebook_channel_details"("user_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "instagram_channel_details_user_channel_id_key" ON "instagram_channel_details"("user_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_channel_details_user_channel_id_key" ON "telegram_channel_details"("user_channel_id");
