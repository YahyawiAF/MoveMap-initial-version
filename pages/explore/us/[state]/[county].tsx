import { Box, Container, ThemeProvider, CssBaseline, Typography } from '@material-ui/core';
import Header from 'components/Header';
import Footer from 'components/Footer';
import theme from 'lib/theme';
import Head from 'next/head';
import consts from 'const';
import { getDateFromFieldName, prettyUrlEncode, prettyUrlDecode } from 'utils';
import prisma from 'lib/client';
import { useRef } from 'react';
import useRefDimensions from 'hooks/useRefDimensions';
import CountyDetails from 'components/CountyDetails';
import geoJsonData from "public/resources/mapping/gz_2010_us_050_00_20m.json";
import useMobileDetect from 'hooks/useMobileDetect';

export async function getStaticPaths() {
  const counties = await prisma.combined_county_data.findMany();
  const paths = counties.map((county) => ({
    params: { 
      state: prettyUrlEncode(county.stateabbreviation),
      county: prettyUrlEncode(county.name)
    },
  }))
  
  return { paths, fallback: false }
}

export async function getStaticProps({params}) {
  const matchedCounty = await prisma.combined_county_data.findFirst({
    where: {
      name: {
        equals: prettyUrlDecode(params.county),
        mode: 'insensitive',
      },
      stateabbreviation: {
        equals: params.state,
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


  return {
    props: {
      matchedCounty,
      cities,
      countyHomeValues: countyHomeValuesProcessed,
      geoJson
    },
  }
}

const CountyPage = ({
  matchedCounty,
  cities,
  countyHomeValues,
  geoJson
}) => {
  const containerRef = useRef();
  const containerDimensions = useRefDimensions(containerRef);

  const fullName = `${matchedCounty.name}, ${matchedCounty.state}`;
  const { isMobile } = useMobileDetect();
  const topCityNames = cities
    .slice(0,3)
    .map(city => city.city_name)
    .join(', ');

  return (
    <div>
      <Head>
        <title>{ `${fullName} - culture, weather, cost, top cities` }</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />  
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content={`Want to move to ${fullName}? Learn about culture, weather, cost, and cities ${topCityNames}.`}
        />
      </Head>
      <main>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header title={`${matchedCounty.name}, ${matchedCounty.state}`} />
          <Container ref={containerRef}>
            <CountyDetails
              matchedCounty={matchedCounty}
              containerDimensions={containerDimensions}
              countyHomeValues={countyHomeValues}
              cities={cities}
              geoJson={geoJson}
            />
          </Container>
          <Footer />
        </ThemeProvider>
      </main>
    </div>
  );
}

export default CountyPage;