import Head from 'next/head';
import { Drawer, Box, Typography, Toolbar, makeStyles, Fab, Hidden, ThemeProvider, CssBaseline } from '@material-ui/core';
import MoveMapContainer from 'components/MoveMapContainer';
import FilterDrawerContents from 'components/filters/FilterDrawerContents';
import consts from 'const';
import EditIcon from '@material-ui/icons/Edit';
import { useRef, useState, useEffect } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import theme from 'lib/theme';
import { PrismaClient } from '@prisma/client';
import { arrayOfObjectsToMap, getMaxValuesMap } from 'utils';
import prisma from 'lib/client';
import useRefDimensions from 'hooks/useRefDimensions';
import { LoadingProvider } from 'lib/LoadingContext';
import useMobileDetect from 'hooks/useMobileDetect';
import { useRouter } from 'next/router';
import { logEvent } from "utils/analytics";

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
  mobileDrawer: {
    width: "100%",
    height: "50%",
    backgroundColor: consts.colors.backgroundGrey,
    borderTop: `3px solid ${consts.logoColors.darkBlue}`,
    paddingLeft: '8%',
    paddingRight: '8%'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    zIndex: theme.zIndex.drawer + 1000,
  },
}));

const INTRO_TEXT= "Trying to figure out where to live? Use the map below to filter down to your personalized set of criteria. Hate the heat? Filter out those sweltering places. Love the sun? Filter out the rainy areas. Want to be close to the coast, or in a more educated area, or in a county that skews younger or older? Use the filters below to find just the right place for you."

export async function getStaticProps() {
  const counties = await prisma.combined_county_data.findMany();
  const countiesMap = arrayOfObjectsToMap(counties, consts.dbFields.fipsCode);
  const maxValuesMap = getMaxValuesMap(counties);

  return {
    props: {
      countyData: counties,
      countyDataDict: countiesMap,
      initialMaxValues: maxValuesMap,
    },
  }
}

export default function Us({ countyData, countyDataDict, initialMaxValues }) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef();
  const containerDimensions = useRefDimensions(containerRef);
  const { isMobile } = useMobileDetect();
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const rentOrBuyKey = router.query[consts.rentOrBuyUrlKey] || consts.rentOrBuyOptions.buy.value;

  const handleDrawerToggle = () => {
    logEvent(consts.logCategories.exploring, consts.logActions.openFilterBar );
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Head>
        <title>MoveMap | explore where to live next</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />  
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content={`Want to move but not sure where? Find places that matches your preferences in weather, culture, and cost of living`}
        />
        <meta property="og:title" content="Movemap - explore where to live next" />
        <meta
          property="og:description"
          content="Find the place that matches your preferences in weather, culture, and cost of living"
        />
      </Head>

      <main>
        <ThemeProvider theme={theme}>
          <LoadingProvider>
            <CssBaseline />
            <Header title="Movemap" />
            <Box display="flex">
              <Box key="drawer">

                <Hidden mdUp implementation="css">
                  <Drawer
                    // container={container}
                    variant="temporary"
                    anchor={'bottom'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                      paper: classes.mobileDrawer,
                    }}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                  >
                    <FilterDrawerContents
                      rentOrBuyKey={rentOrBuyKey}
                    />
                  </Drawer>
                  {/* {scrollY > 100 && <Fab size="large" variant="extended" color="secondary" aria-label="add" className={classes.fab} onClick={handleDrawerToggle}>
                    <EditIcon />
                    <Box marginRight={1} />
                    filter
                  </Fab>} */}
                </Hidden>
                <Hidden smDown implementation="css">
                  <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    open
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                  >
                    <Toolbar />
                    <FilterDrawerContents
                      rentOrBuyKey={rentOrBuyKey}
                    />
                  </Drawer>
                </Hidden>
              </Box>
              <Box key="movemapContainer" width="100%" display="flex" justifyContent="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  paddingX={4}
                  maxWidth="1100px"
                  width="100%"
                  // @ts-ignore
                  ref={containerRef}
                > 
                  <Box>
                    <MoveMapContainer
                      countyData={countyData}
                      countyDataDict={countyDataDict}
                      initialMaxValues={initialMaxValues}
                      handleDrawerToggle={handleDrawerToggle}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box marginTop={100} marginLeft={`${isMobile ? 0 : consts.drawerWidth}px`} display="flex" justifyContent="center" alignItems="center" >
              <Footer />
            </Box>
          </LoadingProvider>
        </ThemeProvider>
      </main>

      <footer>
      </footer>
    </div>
  )
}
