-- CreateTable
CREATE TABLE "CountyHomeValuesTimeSeries" (
    "FipsCode" TEXT NOT NULL PRIMARY KEY,
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
