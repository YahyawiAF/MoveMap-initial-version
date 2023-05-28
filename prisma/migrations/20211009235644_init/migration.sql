/*
  Warnings:

  - The primary key for the `County` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_County" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fipsCode" TEXT NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "stateAbbreviation" TEXT NOT NULL,
    "unemploymentRate2020" REAL NOT NULL,
    "metropolitanArea" TEXT NOT NULL,
    "homePrice2020Q4" INTEGER NOT NULL,
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
    "distanceToAirport" TEXT NOT NULL,
    "isMetroArea" BOOLEAN NOT NULL
);
INSERT INTO "new_County" ("adultsWithBA", "civilianLaborForce2020", "distanceToAirport", "distanceToCoast", "distanceToMountains", "fipsCode", "heatIndexSummerAvgDaily", "homePrice2020Q4", "isMetroArea", "maxTempSummerAvgDaily", "maxTempWinterAvgDaily", "meanTestScoresEB", "meanTestScoresOls", "medianAgeYears2019", "medianGrossRent", "metropolitanArea", "name", "politicsPctDemocrat2020", "politicsPctRepublican2020", "preciptitionAvgInches", "preciptitionAvgInches100Years", "schemaVersion", "state", "stateAbbreviation", "sunlightKjSqM", "taxBurden", "unemploymentRate2020", "weatherBuckets") SELECT "adultsWithBA", "civilianLaborForce2020", "distanceToAirport", "distanceToCoast", "distanceToMountains", "fipsCode", "heatIndexSummerAvgDaily", "homePrice2020Q4", "isMetroArea", "maxTempSummerAvgDaily", "maxTempWinterAvgDaily", "meanTestScoresEB", "meanTestScoresOls", "medianAgeYears2019", "medianGrossRent", "metropolitanArea", "name", "politicsPctDemocrat2020", "politicsPctRepublican2020", "preciptitionAvgInches", "preciptitionAvgInches100Years", "schemaVersion", "state", "stateAbbreviation", "sunlightKjSqM", "taxBurden", "unemploymentRate2020", "weatherBuckets" FROM "County";
DROP TABLE "County";
ALTER TABLE "new_County" RENAME TO "County";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
