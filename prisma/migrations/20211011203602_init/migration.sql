/*
  Warnings:

  - Added the required column `Type` to the `CountyHomeValuesTimeSeries` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CountyHomeValuesTimeSeries" (
    "FipsCode" TEXT NOT NULL PRIMARY KEY,
    "Type" TEXT NOT NULL,
    "RegionID" TEXT NOT NULL,
    "SizeRank" TEXT NOT NULL,
    "RegionName" TEXT NOT NULL,
    "RegionType" TEXT NOT NULL,
    "StateName" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "Metro" TEXT NOT NULL,
    "StateCodeFIPS" TEXT NOT NULL,
    "MunicipalCodeFIPS" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "TypicalHomeValue" INTEGER NOT NULL
);
INSERT INTO "new_CountyHomeValuesTimeSeries" ("Date", "FipsCode", "Metro", "MunicipalCodeFIPS", "RegionID", "RegionName", "RegionType", "SizeRank", "State", "StateCodeFIPS", "StateName", "TypicalHomeValue") SELECT "Date", "FipsCode", "Metro", "MunicipalCodeFIPS", "RegionID", "RegionName", "RegionType", "SizeRank", "State", "StateCodeFIPS", "StateName", "TypicalHomeValue" FROM "CountyHomeValuesTimeSeries";
DROP TABLE "CountyHomeValuesTimeSeries";
ALTER TABLE "new_CountyHomeValuesTimeSeries" RENAME TO "CountyHomeValuesTimeSeries";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
