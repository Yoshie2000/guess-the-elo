-- CreateTable
CREATE TABLE "Game" (
    "url" TEXT NOT NULL PRIMARY KEY,
    "pgnOriginal" TEXT NOT NULL,
    "pgnAnonymized" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false
);
