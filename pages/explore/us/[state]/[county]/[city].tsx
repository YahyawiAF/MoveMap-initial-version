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
import CitySection from 'components/CitySection';
import useMobileDetect from 'hooks/useMobileDetect';


export async function getStaticPaths() {
  const cities = await prisma.combined_city_data.findMany({
    where: {
      population: {
        gte: 12000, 
      }
    }
  });
  const paths = cities.map((city) => {
    return {
      params: {
        state: prettyUrlEncode(city.state_abbreviation),
        county: prettyUrlEncode(city.county),
        city: prettyUrlEncode(city.city_name),
      },
    }
  })
  
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({params}) {
  const matchedCity = await prisma.combined_city_data.findFirst({
    where: {
      city_name: {
        equals: prettyUrlDecode(params.city),
        mode: 'insensitive',
      },
      state_abbreviation: {
        equals: params.state,
        mode: 'insensitive',
      }
    }
  })

  const cityHomeValues = await prisma.cityhomevalues.findFirst({
    where: {
      regionname: {
        equals: matchedCity.city_name,
        mode: 'insensitive',
      },
      state: {
        equals: matchedCity.state_abbreviation,
        mode: 'insensitive',
      }
    }
  })

  const cityHomeValuesProcessed = cityHomeValues
    ? consts.zillowDateFields.map(dateField => {
      return {
        date: getDateFromFieldName(dateField),
        value: cityHomeValues[dateField]
      }
    })
    : [];

  return {
    props: {
      city: matchedCity,
      homeValues: cityHomeValuesProcessed,
    },
  }
}

const CountyPage = ({
  city,
  homeValues
}) => {

  const containerRef = useRef();
  const containerDimensions = useRefDimensions(containerRef);

  const fullName = `${city.city_name}, ${city.state}`;
  const { isMobile } = useMobileDetect();
  return (
    <div>
      <Head>
        <title>{ `${fullName} - home prices, restaurants, grocery stores, and coffee shops` }</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />  
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content={`Want to move to ${fullName}? Learn about the history, culture, and cost of living`}
        />
      </Head>
      <main>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header title={fullName} />
          <Container ref={containerRef}>
            <CitySection 
                cityData={city}
                containerWidth={containerDimensions.width}
                homeValues={homeValues}
            />
          </Container>
          <Footer />
        </ThemeProvider>
      </main>
    </div>
  );
}

export default CountyPage;