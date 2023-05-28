import consts from 'const';
import { getDateFromFieldName, prettyUrlDecode } from 'utils';
import prisma from 'lib/client';
import geoJsonData from "public/resources/mapping/gz_2010_us_050_00_20m.json";

export default async (req, res) => {
  const matchedCounty = await prisma.combined_county_data.findFirst({
    where: {
      name: {
        equals: prettyUrlDecode(req.query.county),
        mode: 'insensitive',
      },
      stateabbreviation: {
        equals: req.query.state,
        mode: 'insensitive',
      }
    }
  })

  const countyHomeValues = await prisma.countyhomevalues.findFirst({
    where: {
      regionname: matchedCounty.name,
      state: matchedCounty.stateabbreviation
    }
  })

  const countyHomeValuesProcessed = countyHomeValues
    ? consts.zillowDateFields.map(dateField => {
      return {
        date: getDateFromFieldName(dateField),
        value: countyHomeValues[dateField]
      }
    })
    : [];

  const cities = await prisma.combined_city_data.findMany({
    where: {
      county: matchedCounty.name,
      state_abbreviation: matchedCounty.stateabbreviation,
    }
  })

  const geoJson = {
    ...geoJsonData,
    features: geoJsonData.features.filter((item) => `${item.properties.STATE}${item.properties.COUNTY}` == matchedCounty.fipscode)
  }


  const processedPageData = {
    matchedCounty,
    cities,
    countyHomeValues: countyHomeValuesProcessed,
    geoJson
  }

  res.status(200).json( processedPageData )
}