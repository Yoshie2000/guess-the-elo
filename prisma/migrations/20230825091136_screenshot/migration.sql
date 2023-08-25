/*
  Warnings:

  - Added the required column `screenshotUrl` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "url" TEXT NOT NULL PRIMARY KEY,
    "pgnOriginal" TEXT NOT NULL,
    "pgnAnonymized" TEXT NOT NULL,
    "screenshotUrl" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Game" ("completed", "pgnAnonymized", "pgnOriginal", "url") SELECT "completed", "pgnAnonymized", "pgnOriginal", "url" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
