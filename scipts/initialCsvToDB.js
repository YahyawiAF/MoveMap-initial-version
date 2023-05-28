const fs = require('fs')
const path = require('path');
const parse = require('csv-parse/lib/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const divideBy100Fields = [
  "Unemployment_rate_2020",
  "Percent of adults with a bachelor's degree or higher, 2015-19",
  "Politics - % democrat 2020",
  "Politics - % republican 2020",
  "Tax burden",
];

const conversions = {
  '2_hours_major_airport': {
    'FALSE': '>2 hours',
    'TRUE': '<2 hours',
  }
}

function getCsvData(nonNumericFields) {
  const dataDirectory = path.join(process.cwd(), 'data');
  const csvPath = path.join(dataDirectory, 'combined_county_data.csv');

  const fileData = fs.readFileSync(csvPath, 'utf-8');
  const countyData = parse(fileData, {columns: true});
  const fieldNames = Object.keys(countyData[0]);

  const maxValueMap = {};
  const countyMap = {};
  const countyDataProcessed = countyData.map(d => {
    if (d.FIPS_Code.length == 4) {
      d.FIPS_Code = "0" + d.FIPS_Code;
    }
    fieldNames.forEach(fieldName => {
      if (!nonNumericFields.includes(fieldName)) {
        // convert string values (e.g. "1,000") to numbers
        const valueWithoutSpecialCharacters = d[fieldName].replace(/,/g, "").replace(/%/g, "")
        let valueAsNumber = +valueWithoutSpecialCharacters;
        if (divideBy100Fields.includes(fieldName)) {
          valueAsNumber = valueAsNumber / 100.0;
        }
        if (isNaN(valueAsNumber)) {
          valueAsNumber = null;
        }
        d[fieldName] = valueAsNumber
      } else if (conversions[fieldName]) {
        d[fieldName] = conversions[fieldName][d[fieldName]];
      } else if (fieldName === 'Area_name') {
        const splitName = d[fieldName].split(',');
        d[fieldName] = splitName[0];
        d['stateAbbr'] = splitName[1].trim();
      }
      if (!maxValueMap[fieldName] || maxValueMap[fieldName] < d[fieldName]) {
        maxValueMap[fieldName] = d[fieldName];
      }

      if (fieldName == "Metropolitan Area") {
        d['isMetroArea'] = d[fieldName].includes("NONMETROPOLITAN AREA") ? false : true;
      }
    })
    countyMap[d.FIPS_Code] = d
    return d;
  })
  return { countyDataProcessed, countyMap, maxValueMap };
}


const nonNumericFields = [
  "FIPS_Code",
  "State",
  "Area_name",
  "is_mountainous",
  "is_coastal",
  "2_hours_major_airport",
  "weather_buckets",
  "Metropolitan Area",
];

const dbFields = {
  'fipsCode': 'FIPS_Code',
  'name': 'Area_name',
  'state': 'State',
  'stateAbbreviation': 'stateAbbr',
  'unemploymentRate2020': 'Unemployment_rate_2020',
  'metropolitanArea': 'Metropolitan Area',
  'homePrice2020Q4': 'Q4 2020 Price',
  'adultsWithBA': "Percent of adults with a bachelor's degree or higher, 2015-19",
  'medianGrossRent': 'Estimate!!Median gross rent --!!Total:',
  'preciptitionAvgInches': 'preciptition avg (inches) last 12 months',
  'preciptitionAvgInches100Years': 'preciptition avg (inches) last 100 years',
  'sunlightKjSqM': 'sunlight (kj / sq m)',
  'maxTempSummerAvgDaily': 'avg daily max temp in summer',
  'maxTempWinterAvgDaily': 'avg daily max temp in winter',
  'heatIndexSummerAvgDaily': 'avg daily max heat index in summer',
  'politicsPctDemocrat2020': 'Politics - % democrat 2020',
  'politicsPctRepublican2020': 'Politics - % republican 2020',
  'taxBurden': 'Tax burden',
  'medianAgeYears2019': '2015-2019 Estimates!!SEX AND AGE!!Total population!!Median age (years)',
  'meanTestScoresOls': 'Mean education public school test scores - Ordinary Least Squares (OLS) estimate',
  'meanTestScoresEB': 'Mean education public school  Test scores - Empirical Bayes (EB) estimate',
  'distanceToCoast': 'is_coastal',
  'distanceToMountains': 'is_mountainous',
  'weatherBuckets': 'weather_buckets',
  'civilianLaborForce2020': 'Civilian_labor_force_2020',
  'distanceToAirport': '2_hours_major_airport',
  'isMetroArea': 'isMetroArea',
};

const { countyDataProcessed, countyMap, maxValueMap } = getCsvData(nonNumericFields);
// const prismaData = prisma.county.findMany().then(data => console.log(data))
const dataForDb = countyDataProcessed.map(csvDatum => {
  const data = {schemaVersion: 0}
  Object.keys(dbFields).forEach(key => {
    const csvFieldName = dbFields[key];
    data[key] = csvDatum[csvFieldName];
  })
  return data
})



dataForDb.forEach(row => {
  const matchedCounty = prisma.county.findFirst({
    where: {
      fipsCode: row.fipsCode
    }
  }).then(matchedCounty => {
    if (!matchedCounty) {
      // console.log('miss')
      prisma.county.create({
        data: row
      }).then(result => console.log(result)).catch(error => console.log(error))
    }
  })




})