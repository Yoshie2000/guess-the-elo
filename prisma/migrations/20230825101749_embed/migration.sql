/*
  Warnings:

  - Added the required column `embedUrl` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "pgnOriginal" TEXT NOT NULL,
    "pgnAnonymized" TEXT NOT NULL,
    "screenshotUrl" TEXT NOT NULL,
    "embedUrl" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Game" ("completed", "id", "pgnAnonymized", "pgnOriginal", "screenshotUrl", "url") SELECT "completed", "id", "pgnAnonymized", "pgnOriginal", "screenshotUrl", "url" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
