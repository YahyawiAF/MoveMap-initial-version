/*
  Warnings:

  - You are about to drop the `CountyHomeValuesTimeSeries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CountyHomeValuesTimeSeries";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CountyHomeValuesByDate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FipsCode" TEXT NOT NULL,
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
