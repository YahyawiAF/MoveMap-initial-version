-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CountyHomeValuesByDate" (
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
    "TypicalHomeValue" INTEGER NOT NULL,
    CONSTRAINT "CountyHomeValuesByDate_FipsCode_fkey" FOREIGN KEY ("FipsCode") REFERENCES "County" ("fipsCode") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CountyHomeValuesByDate" ("Date", "FipsCode", "Metro", "MunicipalCodeFIPS", "RegionID", "RegionName", "RegionType", "SizeRank", "State", "StateCodeFIPS", "StateName", "Type", "TypicalHomeValue", "id") SELECT "Date", "FipsCode", "Metro", "MunicipalCodeFIPS", "RegionID", "RegionName", "RegionType", "SizeRank", "State", "StateCodeFIPS", "StateName", "Type", "TypicalHomeValue", "id" FROM "CountyHomeValuesByDate";
DROP TABLE "CountyHomeValuesByDate";
ALTER TABLE "new_CountyHomeValuesByDate" RENAME TO "CountyHomeValuesByDate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
