/*
  Warnings:

  - The primary key for the `County` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fips_code` on the `County` table. All the data in the column will be lost.
  - Added the required column `fipsCode` to the `County` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_County" (
    "fipsCode" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_County" ("name") SELECT "name" FROM "County";
DROP TABLE "County";
ALTER TABLE "new_County" RENAME TO "County";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
