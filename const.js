const dbFields = Object.freeze({
  id: 'id',
  fipsCode: 'fipscode',
  schemaVersion: 'schemaversion',
  name: 'name',
  state: 'state',
  stateAbbreviation: 'stateabbreviation',
  unemploymentRate2020: 'unemploymentrate2020',
  metropolitanArea: 'metropolitanarea',
  homePrice2020Q4: 'latesthomeprice',
  adultsWithBA: 'adultswithba',
  medianGrossRent: 'mediangrossrent',
  preciptitionAvgInches: 'preciptitionavginches',
  preciptitionAvgInches100Years: 'preciptitionavginches100years',
  sunlightKjSqM: 'sunlightkjsqm',
  maxTempSummerAvgDaily: 'maxtempsummeravgdaily',
  maxTempWinterAvgDaily: 'maxtempwinteravgdaily',
  heatIndexSummerAvgDaily: 'heatindexsummeravgdaily',
  politicsPctDemocrat2020: 'politicspctdemocrat2020',
  politicsPctRepublican2020: 'politicspctrepublican2020',
  taxBurden: 'taxburden',
  medianAgeYears2019: 'medianageyears2019',
  meanTestScoresOls: 'meantestscoresols',
  meanTestScoresEB: 'meantestscoreseb',
  distanceToCoast: 'distancetocoast',
  distanceToMountains: 'distancetomountains',
  weatherBuckets: 'weatherbuckets',
  civilianLaborForce2020: 'civilianlaborforce2020',
  distanceToAirport: 'distancetoairport',
  isMetroArea: 'ismetroarea',
  sunlightkjsqm: 'sunlightkjsqm',
  topCities: 'top_cities'
})

const logCategories = Object.freeze({
  exploring: 'exploring',
  sharing: 'sharing',
  quizzing: 'quizzing',
});

const logActions = Object.freeze({
  click: 'click',
  filter: 'filter',
  expand: 'expand',

  removeFilter: 'remove_filter',
  selectCounty: 'select_county',
  openFilterBar: 'open_filter_bar',
  goToCountyPage: 'go_to_county_page',
  clickCountyDataTable: 'click_county_data_table',
  clickCity: 'click_city',
  selectAmenityType: 'select_amenity_type',
  clickShareButton: 'click_share_button',
  clickQuizAnswer: 'click_quiz_answer',
  submitQuiz: 'submit_quiz',
})

const logParameters = Object.freeze({
  element: 'element',
  state: 'state',
  county: 'county',
  city: 'city'
})

const logElements = Object.freeze({
  countyOnMap: 'countyOnMap',
  countyInTable: 'countyInTable',
  cityCard: 'cityCard',
  amenityPill: 'amenityPill',
  countyDetailsButton: 'countyDetailsButton'
})

const urlArrayDelimiter = '||'
const urlBetweenSymbol = '---';
const drawerWidth = 300;
const allOption = {
  name: "No preference",
  value: "all",
}
const defaultUrlTrueValue = 'yes';
const rentOrBuyUrlKey="rentOrBuy";
const rentOrBuyFriendlyName="Rent or buy";
const rentOrBuyOptions = {
  rent: {
    value: 'rent',
    csvKey: dbFields.medianGrossRent,
    name: "Rent",
    friendlyName: "Monthly rent",
    lowerBound: 400,
    upperBound: 2000,
    colorScale: [
      '#222573', 
      '#3f288a', 
      '#6b3eb0', 
      '#9441c4', 
      '#c246db', 
      '#ff54e0', 
      '#ff3381', 
      '#ff2e2e', 
    ]
  },
  buy: {
    value: 'buy',
    csvKey: dbFields.homePrice2020Q4,
    name: "Buy",
    friendlyName: "Home price",
    lowerBound: 0,
    upperBound: 900000,
    colorScale: [
      'rgb(73, 119, 142)', 
      'rgb(114, 153, 171)', 
      'rgb(153, 192, 180)', 
      'rgb(213, 228, 183)', 
      'rgb(246, 220, 165)', 
      'rgb(223, 160, 125)', 
      'rgb(195, 91, 93)', 
      'rgb(160, 53, 81)', 
    ]
  }
}


const compareModes = {
  greaterThan: 'greaterThan',
  lessThan: 'lessThan',
  between: 'between',
  multipleChoice: 'multipleChoice',
  singleChoice: 'singleChoice',
  boolean: 'boolean',
  multipleChoiceMappedToValues: 'multipleChoiceMappedToValues'
}

const metricFormats = {
  CURRENCY: 'CURRENCY',
  PERCENTAGE: 'PERCENTAGE',
  INTEGER: 'INTEGER',
  FRACTION: 'FRACTION',
  BOOLEAN: 'BOOLEAN',
  BOOLEAN_NUMBER: 'BOOLEAN_NUMBER',
  BOOLEAN_STRING: 'BOOLEAN_STRING',
  STRING: 'STRING'
}

const filters = Object.freeze({
  homePrice: {
    urlKey: 'homePrice',
    csvKey: rentOrBuyOptions.buy.csvKey,
    friendlyName: 'Typical home price',
    minValue: 30000,
    maxValue: 1200000,
    step: 10000,
    compareMode: compareModes.between,
    format: metricFormats.CURRENCY,
    iconKey: "home"
  },
  rentPrice: {
    urlKey: 'rentPrice',
    csvKey: rentOrBuyOptions.rent.csvKey,
    friendlyName: 'Monthly rent',
    minValue: 400,
    maxValue: 2000,
    step: 100,
    compareMode: compareModes.between,
    format: metricFormats.CURRENCY,
    iconKey: "apartment"
  },
  taxBurden: {
    urlKey: 'taxBurden',
    csvKey: dbFields.taxBurden,
    friendlyName: 'State tax burden',
    minValue: 0.05,
    maxValue: 0.13,
    step: 0.01,
    compareMode: compareModes.between,
    format: metricFormats.PERCENTAGE,
    iconKey: 'gavel'
  },
  mountains: {
    urlKey: 'mountains',
    csvKey: dbFields.distanceToMountains,
    friendlyName: 'Mountains',
    compareMode: compareModes.singleChoice,
    iconKey: 'filter_hdr',
    format: metricFormats.STRING,
    options: {
      '1_hour':
        {
          value: '1_hour',
          name: 'Within an hour',
          csvValues: ['Less than 1 hour']
        },
      '3_hours': 
        {
          value: '3_hours',
          name: 'Within 3 hours',
          csvValues: ['Less than 1 hour', '1-3 hours']
        },
      [allOption.value]: 
        {
          value: allOption.value,
          name: 'No preference',
        }
    },
    optionsOrder: [
      [allOption.value],
      '3_hours',
      '1_hour',
    ]
  },
  canabis: {
    urlKey: 'canabis',
    csvKey: dbFields.distanceToMountains,
    friendlyName: 'Canabis',
    compareMode: compareModes.singleChoice,
    iconKey: 'SmokingRooms',
    format: metricFormats.STRING,
    options: {
      'medicalLegal':
        {
          value: 'Legal for medical use',
          name: 'Legal for medical use',
          csvValues: ['Less than 1 hour']
        },
      'recreationalLegal': 
        {
          value: 'Legal for recreational use',
          name: 'Legal for recreational use',
          csvValues: ['Less than 1 hour', '1-3 hours']
        },
        'Illegal': 
        {
          value: 'Illegal',
          name: 'Illegal',
          csvValues: ['Less than 1 hour', '1-3 hours']
        },
        'IllegalDecriminalized': 
        {
          value: 'Illegal & Decriminalized',
          name: 'Illegal & Decriminalized',
          csvValues: ['Less than 1 hour', '1-3 hours']
        },
      [allOption.value]: 
        {
          value: allOption.value,
          name: 'No preference',
        }
    },
    optionsOrder: [
      [allOption.value],
      'medicalLegal',
      'recreationalLegal',
      "Illegal",
      "IllegalDecriminalized"
    ]
  },
  coast: {
    urlKey: 'isCoastal',
    csvKey: dbFields.distanceToCoast,
    friendlyName: 'Coast',
    compareMode: compareModes.singleChoice,
    iconKey: 'beach_access',
    format: metricFormats.BOOLEAN_STRING,
    options: {
      '1_hour':
        {
          value: '1_hour',
          name: 'Within an hour',
          csvValues: ['Within 1 hour']
        },
      '3_hours': 
        {
          value: '3_hours',
          name: 'Within 3 hours',
          csvValues: ['Within 1 hour', '1-3 hours']
        },
      [allOption.value]: 
        {
          value: allOption.value,
          name: 'No preference',
        }
    },
    optionsOrder: [
      [allOption.value],
      '3_hours',
      '1_hour',
    ]
  },
  airport: {
    urlKey: 'airport',
    csvKey: dbFields.distanceToAirport,
    friendlyName: '2 hours to major airport',
    compareMode: compareModes.boolean,
    trueValue: '<2 hours',
    format: metricFormats.BOOLEAN_STRING,
    urlTrueValue: defaultUrlTrueValue,
    trueFriendlyName: 'Yes',
    iconKey: 'flight_take_off'
  },
  metro: {
    urlKey: 'metro',
    csvKey: dbFields.isMetroArea,
    friendlyName: 'Metro area',
    compareMode: compareModes.boolean,
    urlTrueValue: defaultUrlTrueValue,
    trueValue: true,
    format: metricFormats.BOOLEAN,
    trueFriendlyName: 'Yes',
    iconKey: 'directions_bus'
  },
  heatIndex: {
    urlKey: 'heatIndex',
    csvKey: dbFields.heatIndexSummerAvgDaily,
    friendlyName: "Day temp in summer (°F)",
    minValue: 78,
    maxValue: 102,
    step: 1,
    compareMode: compareModes.between,
    format: metricFormats.INTEGER,
    iconKey: 'brightness_high'
  },
  winterTemp: {
    urlKey: 'winterTemp',
    csvKey: dbFields.maxTempWinterAvgDaily,
    friendlyName: 'Day temp in winter (°F)',
    minValue: 19,
    maxValue: 77,
    step: 1,
    compareMode: compareModes.between,
    format: metricFormats.INTEGER,
    iconKey: 'ac_unit'
  },
  sunshine: {
    urlKey: 'sunshine',
    csvKey: dbFields.sunlightkjsqm,
    friendlyName: 'Sun',
    compareMode: compareModes.multipleChoiceMappedToValues,
    format: metricFormats.STRING,
    iconKey: 'wb_sunny',
    options: [
      {
        value: 'not-much',
        name: 'Not much sun',
        minimumValue: 0,
        maximumValue: 14000,
      },
      {
        value: 'some',
        name: 'Some sun',
        minimumValue: 14000,
        maximumValue: 16000,
      },
      {
        value: 'a-lot',
        name: 'A lot of sun',
        minimumValue: 16000,
        maximumValue: 18000,
      },
      {
        value: 'the-most',
        name: 'The most sun',
        minimumValue: 18000,
        maximumValue: 99999999,
      }
    ]
  },
  precipitation: {
    urlKey: 'precipitation',
    csvKey: dbFields.preciptitionAvgInches100Years,
    friendlyName: 'Precipitation',
    compareMode: compareModes.multipleChoiceMappedToValues,
    format: metricFormats.STRING,
    iconKey: 'cloud',
    options: [
      {
        value: 'little',
        name: 'Very little precipitation',
        minimumValue: 0,
        maximumValue: 20,
      },
      {
        value: 'some',
        name: 'Some precipitation',
        minimumValue: 20,
        maximumValue: 40,
      },
      {
        value: 'decent-amount',
        name: 'A decent amount of precipitation',
        minimumValue: 40,
        maximumValue: 60,
      },
      {
        value: 'lots',
        name: 'A lot of precipitation',
        minimumValue: 60,
        maximumValue: 99999999,
      }
    ]
  },
  pctAdultsBA: {
    urlKey: 'pctAdultsBA',
    csvKey: dbFields.adultsWithBA,
    friendlyName: "% adults with BA+",
    minValue: .1,
    maxValue: .6,
    step: 0.01,
    compareMode: compareModes.between,
    format: metricFormats.PERCENTAGE,
    iconKey: 'school'

  },
  medianAge: {
    urlKey: 'medianAge',
    csvKey: dbFields.medianAgeYears2019,
    friendlyName: "Median age",
    minValue: 27,
    maxValue: 56,
    step: 1,
    compareMode: compareModes.between,
    format: metricFormats.INTEGER,
    iconKey: 'date_range'
  },
  testScores: {
    urlKey: 'testScores',
    csvKey: dbFields.meanTestScoresOls,
    friendlyName: "Avg grade school test scores vs national avg",
    minValue: -1.3,
    maxValue: 0.7,
    step: 0.01,
    compareMode: compareModes.between,
    format: metricFormats.FRACTION,
    iconKey: 'create'
  },
  politics: {
    urlKey: 'politics',
    csvKey: dbFields.politicsPctDemocrat2020,
    friendlyName: 'Politics',
    compareMode: compareModes.multipleChoiceMappedToValues,
    format: metricFormats.STRING,
    iconKey: 'how_to_vote',
    options: [
      {
        value: 'very-progressive',
        name: 'Very progressive',
        minimumValue: 0.7,
        maximumValue: 1,
      },
      {
        value: 'somewhat-progressive',
        name: 'Somewhat progressive',
        minimumValue: 0.5,
        maximumValue: 0.7,
      },
      {
        value: 'somewhat-conservative',
        name: 'Somewhat convervative',
        minimumValue: 0.3,
        maximumValue: 0.5,
      },
      {
        value: 'very-conservative',
        name: 'Very conservative',
        minimumValue: 0,
        maximumValue: 0.3,
      }
    ]
  },
})

const showMeOptions = Object.freeze({
  mountainsAirportCoast: {
    value: 'mountainsAirportCoast',
    friendlyName: 'Within 1 hour from mountains, 2 hours from a major airport, and 3 hours from the coast',
    urlQueryParams: {
      [filters.mountains.urlKey]: filters.mountains.options["1_hour"].value,
      [filters.coast.urlKey]: filters.coast.options["3_hours"].value,
      [filters.airport.urlKey]: defaultUrlTrueValue,
    }
  },
  notTooHot: {
    value: 'notTooHot',
    friendlyName: 'That are not too hot and not too cold',
    urlQueryParams: {
      [filters.winterTemp.urlKey]: `50${urlBetweenSymbol}`,
      [filters.heatIndex.urlKey]: `${urlBetweenSymbol}93`,
    }
  },
  notTooExpensive: {
    value: 'notTooExpensive',
    friendlyName: 'Metro areas where the median home price is below 300k',
    urlQueryParams: {
      [filters.metro.urlKey]: defaultUrlTrueValue,
      [filters.homePrice.urlKey]: `${urlBetweenSymbol}300000`,
    },
  },
  young: {
    value: 'young',
    friendlyName: 'Where the population skews younger',
    urlQueryParams: {
      [filters.medianAge.urlKey]: `${urlBetweenSymbol}38`,
    },
  },
})

const quizData = [
  {
    key: filters.airport.urlKey,
    statement: 'I want to live within 2 hours of a major airport',
    urlQueryParams: {
      urlKey: filters.airport.urlKey,
      urlValue: filters.airport.urlTrueValue
    },
    iconKey: filters.airport.iconKey,
  },
  {
    key: filters.winterTemp.urlKey,
    statement: 'I don’t like it when it gets below freezing in winter',
    urlQueryParams: {
      urlKey: filters.winterTemp.urlKey,
      urlValue: `33${urlBetweenSymbol}`
    },
    iconKey: filters.winterTemp.iconKey,
  },
  {
    key: filters.metro.urlKey,
    statement: 'I want to live in a metro area',
    urlQueryParams: {
      urlKey: filters.metro.urlKey,
      urlValue: filters.metro.urlTrueValue
    },
    iconKey: filters.metro.iconKey,
  },
  {
    key: filters.homePrice.urlKey,
    statement: 'I don’t want to pay more than $500k for a house',
    urlQueryParams: {
      urlKey: filters.homePrice.urlKey,
      urlValue: `${urlBetweenSymbol}500000`
    },
    iconKey: filters.homePrice.iconKey,
  },
  {
    key: filters.sunshine.urlKey,
    statement: 'I want it to be sunny most of the time',
    urlQueryParams: {
      urlKey: filters.sunshine.urlKey,
      urlValuesArray: [
        filters.sunshine.options[2].value,
        filters.sunshine.options[3].value,
      ]
    },
    iconKey: filters.sunshine.iconKey,

  },
  {
    key: filters.mountains.urlKey,
    statement: 'I want to live near mountains',
    urlQueryParams: {
      urlKey: filters.mountains.urlKey,
      urlValue: filters.mountains.options['1_hour'].value
    },
    iconKey: filters.mountains.iconKey,
  },
  {
    key: filters.coast.urlKey,
    statement: 'I want to live near the coast',
    urlQueryParams: {
      urlKey: filters.coast.urlKey,
      urlValue: filters.coast.options['1_hour'].value
    },
    iconKey: filters.coast.iconKey,
  },
  {
    key: filters.precipitation.urlKey,
    statement: 'I like it when it rains and/or snows a lot',
    urlQueryParams: {
      urlKey: filters.precipitation.urlKey,
      urlValuesArray: [
        filters.precipitation.options[2].value,
        filters.precipitation.options[3].value
      ]
    },
    iconKey: filters.precipitation.iconKey,
  },
  {
    key: filters.heatIndex.urlKey,
    statement: 'I don’t like it when it gets above 90 degrees in summer',
    urlQueryParams: {
      urlKey: filters.heatIndex.urlKey,
      urlValue: `${urlBetweenSymbol}90`
    },
    iconKey: filters.heatIndex.iconKey,
  },
]

const logoColors = {
  veryDarkBlue: "#0c2d62ff",
  darkBlue: "#1c4a95ff",
  mediumBlue: "#3c8cd6ff",
  lightBlue: "#5fb6faff",
  veryLightBlue: "#b5d7fdff",
  paleBlue: "#daebffff",
}

const colors = {
  backgroundGrey: "#fafafa",
  backgroundGreyOffset: "#f5f5f5",
  veryLightGrey: "#d6d2d2"
}

const zillowDateFields = [
  'dt_2000_01_31',
  'dt_2000_02_29',
  'dt_2000_03_31',
  'dt_2000_04_30',
  'dt_2000_05_31',
  'dt_2000_06_30',
  'dt_2000_07_31',
  'dt_2000_08_31',
  'dt_2000_09_30',
  'dt_2000_10_31',
  'dt_2000_11_30',
  'dt_2000_12_31',
  'dt_2001_01_31',
  'dt_2001_02_28',
  'dt_2001_03_31',
  'dt_2001_04_30',
  'dt_2001_05_31',
  'dt_2001_06_30',
  'dt_2001_07_31',
  'dt_2001_08_31',
  'dt_2001_09_30',
  'dt_2001_10_31',
  'dt_2001_11_30',
  'dt_2001_12_31',
  'dt_2002_01_31',
  'dt_2002_02_28',
  'dt_2002_03_31',
  'dt_2002_04_30',
  'dt_2002_05_31',
  'dt_2002_06_30',
  'dt_2002_07_31',
  'dt_2002_08_31',
  'dt_2002_09_30',
  'dt_2002_10_31',
  'dt_2002_11_30',
  'dt_2002_12_31',
  'dt_2003_01_31',
  'dt_2003_02_28',
  'dt_2003_03_31',
  'dt_2003_04_30',
  'dt_2003_05_31',
  'dt_2003_06_30',
  'dt_2003_07_31',
  'dt_2003_08_31',
  'dt_2003_09_30',
  'dt_2003_10_31',
  'dt_2003_11_30',
  'dt_2003_12_31',
  'dt_2004_01_31',
  'dt_2004_02_29',
  'dt_2004_03_31',
  'dt_2004_04_30',
  'dt_2004_05_31',
  'dt_2004_06_30',
  'dt_2004_07_31',
  'dt_2004_08_31',
  'dt_2004_09_30',
  'dt_2004_10_31',
  'dt_2004_11_30',
  'dt_2004_12_31',
  'dt_2005_01_31',
  'dt_2005_02_28',
  'dt_2005_03_31',
  'dt_2005_04_30',
  'dt_2005_05_31',
  'dt_2005_06_30',
  'dt_2005_07_31',
  'dt_2005_08_31',
  'dt_2005_09_30',
  'dt_2005_10_31',
  'dt_2005_11_30',
  'dt_2005_12_31',
  'dt_2006_01_31',
  'dt_2006_02_28',
  'dt_2006_03_31',
  'dt_2006_04_30',
  'dt_2006_05_31',
  'dt_2006_06_30',
  'dt_2006_07_31',
  'dt_2006_08_31',
  'dt_2006_09_30',
  'dt_2006_10_31',
  'dt_2006_11_30',
  'dt_2006_12_31',
  'dt_2007_01_31',
  'dt_2007_02_28',
  'dt_2007_03_31',
  'dt_2007_04_30',
  'dt_2007_05_31',
  'dt_2007_06_30',
  'dt_2007_07_31',
  'dt_2007_08_31',
  'dt_2007_09_30',
  'dt_2007_10_31',
  'dt_2007_11_30',
  'dt_2007_12_31',
  'dt_2008_01_31',
  'dt_2008_02_29',
  'dt_2008_03_31',
  'dt_2008_04_30',
  'dt_2008_05_31',
  'dt_2008_06_30',
  'dt_2008_07_31',
  'dt_2008_08_31',
  'dt_2008_09_30',
  'dt_2008_10_31',
  'dt_2008_11_30',
  'dt_2008_12_31',
  'dt_2009_01_31',
  'dt_2009_02_28',
  'dt_2009_03_31',
  'dt_2009_04_30',
  'dt_2009_05_31',
  'dt_2009_06_30',
  'dt_2009_07_31',
  'dt_2009_08_31',
  'dt_2009_09_30',
  'dt_2009_10_31',
  'dt_2009_11_30',
  'dt_2009_12_31',
  'dt_2010_01_31',
  'dt_2010_02_28',
  'dt_2010_03_31',
  'dt_2010_04_30',
  'dt_2010_05_31',
  'dt_2010_06_30',
  'dt_2010_07_31',
  'dt_2010_08_31',
  'dt_2010_09_30',
  'dt_2010_10_31',
  'dt_2010_11_30',
  'dt_2010_12_31',
  'dt_2011_01_31',
  'dt_2011_02_28',
  'dt_2011_03_31',
  'dt_2011_04_30',
  'dt_2011_05_31',
  'dt_2011_06_30',
  'dt_2011_07_31',
  'dt_2011_08_31',
  'dt_2011_09_30',
  'dt_2011_10_31',
  'dt_2011_11_30',
  'dt_2011_12_31',
  'dt_2012_01_31',
  'dt_2012_02_29',
  'dt_2012_03_31',
  'dt_2012_04_30',
  'dt_2012_05_31',
  'dt_2012_06_30',
  'dt_2012_07_31',
  'dt_2012_08_31',
  'dt_2012_09_30',
  'dt_2012_10_31',
  'dt_2012_11_30',
  'dt_2012_12_31',
  'dt_2013_01_31',
  'dt_2013_02_28',
  'dt_2013_03_31',
  'dt_2013_04_30',
  'dt_2013_05_31',
  'dt_2013_06_30',
  'dt_2013_07_31',
  'dt_2013_08_31',
  'dt_2013_09_30',
  'dt_2013_10_31',
  'dt_2013_11_30',
  'dt_2013_12_31',
  'dt_2014_01_31',
  'dt_2014_02_28',
  'dt_2014_03_31',
  'dt_2014_04_30',
  'dt_2014_05_31',
  'dt_2014_06_30',
  'dt_2014_07_31',
  'dt_2014_08_31',
  'dt_2014_09_30',
  'dt_2014_10_31',
  'dt_2014_11_30',
  'dt_2014_12_31',
  'dt_2015_01_31',
  'dt_2015_02_28',
  'dt_2015_03_31',
  'dt_2015_04_30',
  'dt_2015_05_31',
  'dt_2015_06_30',
  'dt_2015_07_31',
  'dt_2015_08_31',
  'dt_2015_09_30',
  'dt_2015_10_31',
  'dt_2015_11_30',
  'dt_2015_12_31',
  'dt_2016_01_31',
  'dt_2016_02_29',
  'dt_2016_03_31',
  'dt_2016_04_30',
  'dt_2016_05_31',
  'dt_2016_06_30',
  'dt_2016_07_31',
  'dt_2016_08_31',
  'dt_2016_09_30',
  'dt_2016_10_31',
  'dt_2016_11_30',
  'dt_2016_12_31',
  'dt_2017_01_31',
  'dt_2017_02_28',
  'dt_2017_03_31',
  'dt_2017_04_30',
  'dt_2017_05_31',
  'dt_2017_06_30',
  'dt_2017_07_31',
  'dt_2017_08_31',
  'dt_2017_09_30',
  'dt_2017_10_31',
  'dt_2017_11_30',
  'dt_2017_12_31',
  'dt_2018_01_31',
  'dt_2018_02_28',
  'dt_2018_03_31',
  'dt_2018_04_30',
  'dt_2018_05_31',
  'dt_2018_06_30',
  'dt_2018_07_31',
  'dt_2018_08_31',
  'dt_2018_09_30',
  'dt_2018_10_31',
  'dt_2018_11_30',
  'dt_2018_12_31',
  'dt_2019_01_31',
  'dt_2019_02_28',
  'dt_2019_03_31',
  'dt_2019_04_30',
  'dt_2019_05_31',
  'dt_2019_06_30',
  'dt_2019_07_31',
  'dt_2019_08_31',
  'dt_2019_09_30',
  'dt_2019_10_31',
  'dt_2019_11_30',
  'dt_2019_12_31',
  'dt_2020_01_31',
  'dt_2020_02_29',
  'dt_2020_03_31',
  'dt_2020_04_30',
  'dt_2020_05_31',
  'dt_2020_06_30',
  'dt_2020_07_31',
  'dt_2020_08_31',
  'dt_2020_09_30',
  'dt_2020_10_31',
  'dt_2020_11_30',
  'dt_2020_12_31',
  'dt_2021_01_31',
  'dt_2021_02_28',
  'dt_2021_03_31',
  'dt_2021_04_30',
  'dt_2021_05_31',
  'dt_2021_06_30',
  'dt_2021_07_31',
  'dt_2021_08_31',
  'dt_2021_09_30',
]

const URLS = Object.freeze({
  explorePage: '/explore/us',
  quizPage: '/quiz',
  countyPage: '/explore/us/[state]/[county]',
  cityPage: '/explore/us/[state]/[county]/[city]'
});

const domNodeIds = Object.freeze({
  countyMap: 'county_map',
  canvasForMapSharing : 'canvas_for_map_share'
})

const countyMapDimensions = Object.freeze({
  width: 500,
  height: 500,
})

const consts = {
  compareModes,
  filters,
  urlArrayDelimiter,
  allOption,
  rentOrBuyOptions,
  rentOrBuyUrlKey,
  rentOrBuyFriendlyName,
  defaultUrlTrueValue,
  showMeOptions,
  urlBetweenSymbol,
  drawerWidth,
  dbFields,
  zillowDateFields,
  logoColors,
  colors,
  mobileWidth: 400,
  metricFormats,
  HEADER_HEIGHT: 65,
  logCategories,
  logActions,
  quizData,
  baseUrl: 'https://www.movemap.io',
  URLS,
  domNodeIds,
  countyMapDimensions
}

export default consts;