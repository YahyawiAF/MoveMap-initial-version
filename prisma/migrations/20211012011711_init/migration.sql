/*
  Warnings:

  - You are about to drop the column `schemaVersion` on the `County` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_County" (
    "fipsCode" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "stateAbbreviation" TEXT NOT NULL,
    "unemploymentRate2020" REAL,
    "metropolitanArea" TEXT NOT NULL,
    "homePrice2020Q4" INTEGER,
    "adultsWithBA" REAL,
    "medianGrossRent" INTEGER,
    "preciptitionAvgInches" REAL,
    "preciptitionAvgInches100Years" REAL,
    "sunlightKjSqM" REAL,
    "maxTempSummerAvgDaily" REAL,
    "maxTempWinterAvgDaily" REAL,
    "heatIndexSummerAvgDaily" REAL,
    "politicsPctDemocrat2020" REAL,
    "politicsPctRepublican2020" REAL,
    "taxBurden" REAL NOT NULL,
    "medianAgeYears2019" REAL,
    "meanTestScoresOls" REAL,
    "meanTestScoresEB" REAL,
    "distanceToCoast" TEXT NOT NULL,
    "distanceToMountains" TEXT NOT NULL,
    "weatherBuckets" TEXT,
    "civilianLaborForce2020" INTEGER,
    "distanceToAirport" TEXT NOT NULL,
    "isMetroArea" BOOLEAN NOT NULL
);
INSERT INTO "new_County" ("adultsWithBA", "civilianLaborForce2020", "distanceToAirport", "distanceToCoast", "distanceToMountains", "fipsCode", "heatIndexSummerAvgDaily", "homePrice2020Q4", "isMetroArea", "maxTempSummerAvgDaily", "maxTempWinterAvgDaily", "meanTestScoresEB", "meanTestScoresOls", "medianAgeYears2019", "medianGrossRent", "metropolitanArea", "name", "politicsPctDemocrat2020", "politicsPctRepublican2020", "preciptitionAvgInches", "preciptitionAvgInches100Years", "state", "stateAbbreviation", "sunlightKjSqM", "taxBurden", "unemploymentRate2020", "weatherBuckets") SELECT "adultsWithBA", "civilianLaborForce2020", "distanceToAirport", "distanceToCoast", "distanceToMountains", "fipsCode", "heatIndexSummerAvgDaily", "homePrice2020Q4", "isMetroArea", "maxTempSummerAvgDaily", "maxTempWinterAvgDaily", "meanTestScoresEB", "meanTestScoresOls", "medianAgeYears2019", "medianGrossRent", "metropolitanArea", "name", "politicsPctDemocrat2020", "politicsPctRepublican2020", "preciptitionAvgInches", "preciptitionAvgInches100Years", "state", "stateAbbreviation", "sunlightKjSqM", "taxBurden", "unemploymentRate2020", "weatherBuckets" FROM "County";
DROP TABLE "County";
ALTER TABLE "new_County" RENAME TO "County";
CREATE UNIQUE INDEX "County_fipsCode_key" ON "County"("fipsCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
