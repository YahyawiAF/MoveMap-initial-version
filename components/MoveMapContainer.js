import { useEffect, useState, useCallback, useContext } from 'react';
import useWindowSize from 'hooks/useWindowSize';
import CountyMap from 'components/visualizations/CountyMap';
import { Box, Typography, Backdrop, CircularProgress, Button, Hidden } from '@material-ui/core';
import DataTable from './visualizations/DataTable';
import { useRouter } from 'next/router';
import consts from 'const';
import { map, meetsCriteria, prettyNumberFormat, getCountyDetailsUrl } from 'utils';
import Legend from 'components/visualizations/Legend';
import CountyDetailsSheet from './CountyDetailsSheet';
import { useLoading } from "lib/LoadingContext";
import FilterChips from 'components/FilterChips';
import useMobileDetect from 'hooks/useMobileDetect';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core';
import { logEvent } from 'utils/analytics';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


const MoveMapContainer = ({ countyData, countyDataDict, initialMaxValues, handleDrawerToggle }) => {
  const { isMobile } = useMobileDetect();
  const [maxValues, setMaxValues] = useState(initialMaxValues);
  const [maxSelectedHomePrice, setMaxSelectedHomePrice] = useState(1200000);
  const [scatterHeight, setScatterHeight] = useState(500);
  const [scatterWidth, setScatterWidth] = useState(400);
  const [mapHeight, setMapHeight] = useState(500);
  const [mapWidth, setMapWidth] = useState(500);
  const [scatterNode, setScatterNode] = useState();
  const [mapNode, setMapNode] = useState();
  const [rentOrBuyKey, setRentOrBuyKey] = useState(consts.rentOrBuyOptions.buy.value);
  const { width, height } = useWindowSize();
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [filteredCountyData, setFilteredCountyData] = useState(countyData);
  const { loading, setLoading } = useLoading();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));



  const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiDataGrid-columnHeader': {
        padding: '0 0 0 1px'
      },
    },
    subHeader: {
      zIndex: theme.zIndex.drawer - 1,
    },
  }));
  const classes = useStyles();

  const priceColumn = rentOrBuyKey === consts.rentOrBuyOptions.buy.value
  ? {
    field: consts.rentOrBuyOptions.buy.csvKey,
    headerName: 'Home $',
    flex: 0.7,
    minWidth: 90,
    type: 'number',
    editable: false,
    disableColumnMenu: true,
  }
  : {
    field: consts.rentOrBuyOptions.rent.csvKey,
    headerName: 'Rent $',
    flex: 0.7,
    minWidth: 90,
    type: 'number',
    editable: false,
    disableColumnMenu: true,
  };
  const tableColumns = [
    {
      field: consts.dbFields.name,
      headerName: 'County',
      flex: 0.8,
      minWidth: 70,
      editable: false,
      disableColumnMenu: true,
      headerClassName: 'super-app-theme--header',
      valueGetter: (params) => {
        const countyValue = params.value;
        return isMobile ? countyValue.replace(' County', '') : countyValue;
      },
    },
    {
      field: isMobile ? consts.dbFields.stateAbbreviation : consts.dbFields.state,
      headerName: 'State',
      flex: 0.6,
      minWidth: isMobile ? 20 : 120,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: consts.dbFields.topCities,
      headerName: isMobile ? 'Largest city' : 'Biggest cities',
      flex: 0.9,
      minWidth: isMobile ? 50 : 150,
      editable: false,
      disableColumnMenu: true,
      filterable: false,
      sortable: false,
      valueGetter: (params) => {
        const cities = isMobile ? params.value.slice(0, 1) : params.value;
        return cities.join(', ');
      },
    },
    priceColumn
  ];
  const router = useRouter();
  // console.log(countyData)
  useEffect(() => {
    setFilteredCountyDataAndMaxValues();
    const rentOrBuyKeyTemp = router.query[consts.rentOrBuyUrlKey] || consts.rentOrBuyOptions.buy.value;
    setRentOrBuyKey(rentOrBuyKeyTemp);
    setLoading(false);
  }, [router.query])

  useEffect(() => {
    const rentOrBuyKeyTemp = router.query[consts.rentOrBuyUrlKey] || consts.rentOrBuyOptions.buy.value;
    setRentOrBuyKey(rentOrBuyKeyTemp);
  }, [])

  useEffect(() => {
    if (scatterNode) {
      const scatterRect = scatterNode.getBoundingClientRect();
      setScatterHeight(scatterRect.height);
      setScatterWidth(scatterRect.width);
    }
    if (mapNode) {
      const mapRect = mapNode.getBoundingClientRect();
      setMapHeight(mapRect.height);
      setMapWidth(mapRect.width);
    }
  }, [scatterNode, mapNode, width])

  const measuredScatterContainerRef = useCallback(node => {
    if (node !== null) {
      setScatterNode(node);
      }
    }, [width]);

  const measuredMapContainerRef = useCallback(node => {
    if (node !== null) {
      setMapNode(node);
      }
    }, [width]);

  const setFilteredCountyDataAndMaxValues = () => {
    const maxValueMap = {};
    const fieldNames = Object.keys(countyData[0]);
    const filteredCountyData = countyData.filter((d) => meetsCriteria(d, router.query));
    setFilteredCountyData(filteredCountyData);
    filteredCountyData.forEach((d) => {
      fieldNames.forEach(fieldName => {
        if (!maxValueMap[fieldName] || maxValueMap[fieldName] < d[fieldName]) {
          maxValueMap[fieldName] = d[fieldName];
        }
      })
    });   
    setMaxValues(maxValueMap);
  }

  const getHomePriceColor = (value) => {
    const rentOrBuyData = consts.rentOrBuyOptions[rentOrBuyKey]
    const lowerBound = rentOrBuyData.lowerBound;
    const upperBound = rentOrBuyData.upperBound;
    const colorScale = rentOrBuyData.colorScale;
    const bucket = Math.floor(map(value, lowerBound, upperBound, 0, 8));
    if (bucket >= 0) {
      return colorScale[Math.min(bucket, 7)];
    }
    return '#ddd';
  }

  const filterValues = {
    maxSelectedHomePrice
  };

  if (!countyDataDict) {
    return null;
  }
  // console.log(filteredCountyData);
  const yAxisValueFromUrl = router.query[consts.rentOrBuyUrlKey];
  const yAxisCsvKey = consts.rentOrBuyOptions[yAxisValueFromUrl]?.csvKey || consts.rentOrBuyOptions.buy.csvKey;

  return (
    <Box marginTop={4} marginBottom={0}>
      <Box>
        <Box height={isMobile && filteredCountyData.length == 0 ? 50 : 30}></Box>
        <Box
          position="fixed"
          top={consts.HEADER_HEIGHT}
          left={isMobile || !isMdUp ? 0 : consts.drawerWidth}
          right={0}
          bgcolor="white"
          className={classes.subHeader}
        >
          <Box borderBottom="3px solid lightGrey" paddingY={2} paddingX={4} display="flex" alignItems="center">
            <Box marginRight={4}>
              <Typography display="inline" variant="h4">{prettyNumberFormat(filteredCountyData.length, false, false )} </Typography>
              <Typography display="inline">counties match your criteria. </Typography>
              {filteredCountyData.length == 0 && 
                <Typography display="inline" style={{color: 'red'}}>Please remove some filters</Typography>}
            </Box>
          </Box>
        </Box>
        <FilterChips /> 
        <Box ref={measuredMapContainerRef} position="relative">
          {mapWidth && countyDataDict &&
            <Box
              paddingTop={2}
              position="relative"
            >
              {loading && 
              <Box
                position="absolute"
                left={0}
                top={0}
                right={0}
                bottom={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgcolor="rgba(255,255,255,0.5)"
              >
                <CircularProgress color="inherit" />
              </Box>}
              <CountyMap
                countyDataDict={countyDataDict}
                getColor={getHomePriceColor}
                meetsCriteria={(countyData) => meetsCriteria(countyData, router.query)}
                colorField={yAxisCsvKey}
                width={consts.countyMapDimensions.width}
                height={consts.countyMapDimensions.height}
                selectedCounty={selectedCounty}
                setSelectedCounty={setSelectedCounty}
              />
              {!selectedCounty && 
              <Hidden smDown implementation="css">
                <Box
                  position={isMobile ? "block" : "absolute"}
                  top={12}
                  right={'10%'}
                  bgcolor="rgba(255, 255, 255, 0.8)"
                  paddingY={1}
                  paddingX={2}
                  borderRadius={4}
                >
                  <Legend options={consts.rentOrBuyOptions[rentOrBuyKey]} />

                </Box>
              </Hidden>
              }
            </Box>
          }
          {selectedCounty && 
          <Box
            position={isMobile ? "relative" : "absolute"}
            top={isMobile ? 0 : 20}
            right={isMobile ? 0 : 20}
            maxWidth={isMobile ? "100%" : 300}
            paddingTop={4}
          >
            <CountyDetailsSheet
              selectedCounty={selectedCounty}
              setSelectedCounty={setSelectedCounty}
            />
          </Box>
          }
        </Box>
      </Box>
      {!selectedCounty && 
        <Hidden mdUp implementation="css">
          <Box>
            <Legend options={consts.rentOrBuyOptions[rentOrBuyKey]} />
            <Box paddingX={2} paddingTop={4}>
              <Button color="secondary" onClick={handleDrawerToggle} style={{
                width: '100%',
                height: "42px",
                }}>
                <EditIcon fontSize="small"/>
                <Box marginRight={1}></Box>
                <Typography >Filter</Typography>
              </Button>
            </Box>
          </Box>
        </Hidden>}
      {!selectedCounty && (
      <Box marginTop={6} className={classes.root}>
        <DataTable
          data={filteredCountyData}
          columns={tableColumns}
          idColumnName={consts.dbFields.fipsCode}
          onRowClick={(row) => {
            const selectedCountyDetailsUrl = getCountyDetailsUrl(row);
            logEvent(consts.logCategories.exploring, consts.logActions.clickCountyDataTable, row[consts.dbFields.name])
            window.open(selectedCountyDetailsUrl);
          }}
        />
        <Box height={'0px'} width={'0px'}>
          <canvas
            id={consts.domNodeIds.canvasForMapSharing}
            display="none"
            width={consts.countyMapDimensions.width}
            height={consts.countyMapDimensions.height}
            style={{visibility: "hidden"}}
          ></canvas>
        </Box>
      </Box>

      )}
    </Box>
  )

};

export default MoveMapContainer;

