/*
  Warnings:

  - Added the required column `adultsWithBA` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaName` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civilianLaborForce2020` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceToAirport` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceToCoast` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceToMountains` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heatIndexSummerAvgDaily` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTempSummerAvgDaily` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTempWinterAvgDaily` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meanTestScoresEB` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meanTestScoresOls` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medianAgeYears2019` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medianGrossRent` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metropolitanArea` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `politicsPctDemocrat2020` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `politicsPctRepublican2020` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preciptitionAvgInches` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preciptitionAvgInches100Years` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price2020Q4` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateAbbreviation` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunlightKjSqM` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxBurden` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unemploymentRate2020` to the `County` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weatherBuckets` to the `County` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_County" (
    "fipsCode" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "stateAbbreviation" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "unemploymentRate2020" REAL NOT NULL,
    "metropolitanArea" REAL NOT NULL,
    "price2020Q4" INTEGER NOT NULL,
    "adultsWithBA" REAL NOT NULL,
    "medianGrossRent" INTEGER NOT NULL,
    "preciptitionAvgInches" REAL NOT NULL,
    "preciptitionAvgInches100Years" REAL NOT NULL,
    "sunlightKjSqM" REAL NOT NULL,
    "maxTempSummerAvgDaily" REAL NOT NULL,
    "maxTempWinterAvgDaily" REAL NOT NULL,
    "heatIndexSummerAvgDaily" REAL NOT NULL,
    "politicsPctDemocrat2020" REAL NOT NULL,
    "politicsPctRepublican2020" REAL NOT NULL,
    "taxBurden" REAL NOT NULL,
    "medianAgeYears2019" REAL NOT NULL,
    "meanTestScoresOls" REAL NOT NULL,
    "meanTestScoresEB" REAL NOT NULL,
    "distanceToCoast" TEXT NOT NULL,
    "distanceToMountains" TEXT NOT NULL,
    "weatherBuckets" TEXT NOT NULL,
    "civilianLaborForce2020" INTEGER NOT NULL,
    "distanceToAirport" TEXT NOT NULL
);
INSERT INTO "new_County" ("fipsCode", "name") SELECT "fipsCode", "name" FROM "County";
DROP TABLE "County";
ALTER TABLE "new_County" RENAME TO "County";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
