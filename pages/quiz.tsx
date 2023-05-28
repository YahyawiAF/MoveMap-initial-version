import Head from 'next/head';
import { Card, Box, Typography,  makeStyles, ThemeProvider, CssBaseline, CardContent, CardActionArea, Icon, Button, CircularProgress, Container } from '@material-ui/core';
import consts from 'const';
import { useRef, useState, useEffect } from 'react';
import Header from 'components/Header';
import theme from 'lib/theme';
import prisma from 'lib/client';
import useMobileDetect from 'hooks/useMobileDetect';
import { useRouter } from 'next/router';
import { logEvent } from "utils/analytics";
import { meetsCriteria, prettyNumberFormat, setRouteParams } from 'utils';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: consts.drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: consts.drawerWidth,
    backgroundColor: consts.colors.backgroundGrey
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    zIndex: theme.zIndex.drawer + 1000,
  },
}));


export async function getStaticProps() {
  const counties = await prisma.combined_county_data.findMany();

  return {
    props: {
      countyData: counties,
    },
  }
}

const BASE_URL = '/explore/us';

export default function Quiz({ countyData }) {
  const classes = useStyles();
  const { isMobile } = useMobileDetect();
  const router = useRouter();
  const [filteredCountyData, setFilteredCountyData] = useState(countyData);
  const [selectedStatements, setSelectedStatements] = useState([]);
  const [link, setLink] = useState(BASE_URL);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedStatements(Object.keys(router.query));
    const filteredCountyData = countyData.filter((d) => meetsCriteria(d, router.query));
    setFilteredCountyData(filteredCountyData);
  }, [router.query])

  const handleStatementClick = (statementKey) => {
    logEvent(consts.logCategories.quizzing, consts.logActions.clickQuizAnswer, statementKey);
    let newSelectedStatements;
    var index = selectedStatements.indexOf(statementKey);
    if (index !== -1) {
      newSelectedStatements = selectedStatements;
      newSelectedStatements.splice(index, 1);
    } else {
      newSelectedStatements = [...selectedStatements, statementKey];
    }
    setSelectedStatements(newSelectedStatements);

    const newQuery = consts.quizData
      .filter(quizDatum => newSelectedStatements.includes(quizDatum.key))
      .reduce((accumulator, quizDatum) => {
        const urlValue = quizDatum.urlQueryParams.urlValue
          ? quizDatum.urlQueryParams.urlValue
          : quizDatum.urlQueryParams.urlValuesArray.join(consts.urlArrayDelimiter);
        accumulator[quizDatum.urlQueryParams.urlKey] = urlValue;
        return accumulator;
      }, {})
    setRouteParams(newQuery, router);
    const filteredCountyData = countyData.filter((d) => meetsCriteria(d, newQuery));
    setFilteredCountyData(filteredCountyData);
  };

  const handleButtonClick = async () => {
    await setIsLoading(true);
    const newQuery = consts.quizData
      .filter(quizDatum => selectedStatements.includes(quizDatum.key))
      .reduce((accumulator, quizDatum) => {
        const urlValue = quizDatum.urlQueryParams.urlValue
          ? quizDatum.urlQueryParams.urlValue
          : quizDatum.urlQueryParams.urlValuesArray.join(consts.urlArrayDelimiter);
        accumulator[quizDatum.urlQueryParams.urlKey] = urlValue;
        return accumulator;
      }, {})
    logEvent(consts.logCategories.quizzing, consts.logActions.submitQuiz, Object.keys(newQuery).join(', '));
    router.push(
      {pathname: BASE_URL, query: newQuery},
      undefined,
      {scroll: true }
      )
  }

  return (
    <div>
      <Head>
        <title>MoveMap quiz - figure out where to live next</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content={`Answer a few questions and find out what places match your preferences`}
        />
        <meta property="og:title" content="Movemap - explore where to live next" />
        <meta
          property="og:description"
          content="Answer a few questions and find out what places match your preferences"
        />
        <meta
          property="og:image"
          content="https://www.movemap.io/resources/images/hero_image.png"
        />
      </Head>

      <main>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header title="Movemap" />
          <Container>
            <Box padding={2}>
              <Box paddingBottom={6}>
                <Typography variant="h1" style={{ lineHeight: 1.6 }}>
                  {`Select `}
                  <strong>
                    at least 3 statements
                  </strong>
                  {` that are true for you`}
                </Typography>
                <Typography variant="caption">
                  {`Or `}
                  <Link href={BASE_URL} passHref>
                    skip to the map
                  </Link>
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" marginBottom={30}>
                {consts.quizData.map(quizDatum => {
                  return (
                    <Box
                      minWidth={200}
                      maxWidth={500}
                      marginBottom={6}
                      marginRight={isMobile ? 2 : 6}
                      key={quizDatum.key}
                    >
                      <Button
                        variant="outlined"
                        style={{textTransform: 'none', backgroundColor: selectedStatements.includes(quizDatum.key) ? consts.logoColors.lightBlue : "white" }}
                        onClick={() => handleStatementClick(quizDatum.key)}>
                        <Box
                          display="flex"
                          alignItems="center"
                          padding={4}
                        >
                          <Box paddingRight={2}>
                            <Icon>{quizDatum.iconKey}</Icon>
                          </Box>
                          <Typography>
                            {quizDatum.statement}
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  )
                })}
                <Box
                  position="fixed"
                  left={0}
                  bottom={0}
                  right={0}
                  display="flex"
                  justifyContent="center"
                  paddingY={2}
                  paddingX={6}
                  bgcolor={consts.colors.backgroundGrey}
                >
                  <Box marginRight={4}>
                    <Typography variant="h2">
                      <strong>
                        {prettyNumberFormat(filteredCountyData.length, false, false )}
                      </strong>
                      {` places match your criteria`}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Button
                      disabled={selectedStatements.length < 3 || filteredCountyData.length <= 0}
                      variant="contained"
                      color={"secondary"}
                      onClick={handleButtonClick}
                      style={{textTransform: 'none'}}
                    >
                      <Box padding={0}>
                        {isLoading ? <Box padding={4}><CircularProgress size={20} style={{ color: "white"}} /></Box> : "See results"}
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </main>

      <footer>
      </footer>
    </div>
  )
}
