-- CreateTable
CREATE TABLE "line_channel_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_channel_id" INTEGER NOT NULL,
    "channel_id" TEXT,
    "channel_secret" TEXT,
    "channel_access_token" TEXT,
    CONSTRAINT "line_channel_details_user_channel_id_fkey" FOREIGN KEY ("user_channel_id") REFERENCES "user_channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "line_channel_details_user_channel_id_key" ON "line_channel_details"("user_channel_id");
