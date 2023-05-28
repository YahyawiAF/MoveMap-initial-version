const fs = require('fs')
const path = require('path');
const parse = require('csv-parse/lib/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const csvFileName = 'County_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month'
const dataDirectory = path.join(process.cwd(), 'data');
const csvPath = path.join(dataDirectory, `${csvFileName}.csv`);

const fileData = fs.readFileSync(csvPath, 'utf-8');
const countyData = parse(fileData, {columns: true});

const nonNumericFields = [
  'RegionID',
  'SizeRank',
  'RegionName',
  'RegionType',
  'StateName',
  'State',
  'Metro',
  'StateCodeFIPS',
  'MunicipalCodeFIPS',
];

const dateValueFields = Object.keys(countyData[0]).filter(fieldName => !nonNumericFields.includes(fieldName))

// prisma.countyHomeValuesByDate.groupBy({
//   by: 'FipsCode'
// }).then(result => console.log(result))
// // findMany({
// //   select: ['FipsCode'],
// //   groupBy:   
// // })

// console.log(existingFips);

countyData.forEach(row => {
  const FipsCode = `${row['StateCodeFIPS']}${row['MunicipalCodeFIPS']}`
  prisma.countyHomeValuesByDate.findFirst({
    where: {
      FipsCode: FipsCode
    }
  }).then(matchedResult => {
    if (!matchedResult) {
      dateValueFields.forEach(dateFieldName => {
        const dataToInsert = {
          FipsCode,
          Type: csvFileName,
        };
        dataToInsert.Date = dateFieldName;
        dataToInsert.TypicalHomeValue = Number(row[dateFieldName]);
        nonNumericFields.forEach(fieldKey => {
          dataToInsert[fieldKey] = row[fieldKey];
        })
        prisma.countyHomeValuesByDate.create({
          data: dataToInsert
        }).then().catch(error => console.log(error))
      })
    }
  })
  
})