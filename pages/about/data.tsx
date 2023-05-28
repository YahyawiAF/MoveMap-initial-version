import { Box, Container, Typography, ThemeProvider, CssBaseline, Link } from '@material-ui/core';
import Head from 'next/head';
import theme from 'lib/theme';
import Header from 'components/Header';

const dataSources = [
  {
    label: 'Employment & rental costs',
    sources: [
      {
        linkText: 'American Community Survey',
        link: 'https://www.census.gov/programs-surveys/acs'
      }
    ],
  },
  {
    label: 'Housing costs',
    sources: [
      {
        linkText: 'Zillow',
        link: 'https://www.zillow.com/research/data/'
      }
    ],
  },
  {
    label: 'Weather',
    sources: [
      {
        linkText: 'noaa',
        link: 'https://www.ncdc.noaa.gov/',
      },
      {
        linkText: 'cdc wonder',
        link: 'https://wonder.cdc.gov/',
      },
    ]
  },
  {
    label: 'Tax Burden',
    sources: [
      {
        linkText: 'Tax Policy Center',
        link: 'https://www.taxpolicycenter.org/statistics',
      }
    ]
  },
  {
    label: 'Airports',
    sources: [
      {
        linkText: 'Wikipedia',
        link: 'https://en.wikipedia.org/wiki/List_of_the_busiest_airports_in_the_United_States'
      }
    ],
  },
  {
    label: 'Education',
    sources: [
      {
        linkText: 'Ed Opportunity',
        link: 'https://edopportunity.org/get-the-data/seda-archive-downloads/'
      }
    ],
  },

]

export default function AboutData() {
  return (
    <div>
      <Head>
        <title>About the data</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />  
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <main>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header title={'About the data'} />
          <Container>
            <Box paddingTop={10} paddingBottom={2}>
              {dataSources.map(dataSource => {
                return (
                  <Box paddingY={2}>
                    <Typography >{dataSource.label}</Typography>
                    {dataSource.sources.map(source => {
                      return (
                        <Box>
                          <Link
                            href={source.link}
                            target="_blank"
                            rel="noopener"
                          >
                            {source.linkText}
                          </Link>{' '}
                        </Box>
                      )
                    })}
                    
                  </Box>
                )
              })}
              
            </Box>
          </Container>
        </ThemeProvider>
      </main>
    </div>
  );
}