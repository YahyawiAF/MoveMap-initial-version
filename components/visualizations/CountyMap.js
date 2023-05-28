import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import geos from "public/resources/mapping/counties-10m.json";
import dynamic from "next/dynamic";
import TooltipContents from 'components/TooltipContents';
import { Box, Button, IconButton, Typography } from '@material-ui/core';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import consts from 'const';
import { setRouteParams } from 'utils';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import useMobileDetect from 'hooks/useMobileDetect';
import { logEvent } from "utils/analytics";

const MAX_DEFAULT_MOBILE_ZOOM = 40;
const SELECTED_COUNTY_ZOOM = 12;

const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "white",
    color: "black",
    border: "1px solid gray",
    '&:hover': {
      backgroundColor: '#c7c7c7',
      border: "1px solid gray",
      boxShadow: 'none',
    },
  },
  bold: {
    fontWeight: 600,
  },
}));

const CountyMap = ({ countyDataDict, getColor, meetsCriteria, colorField, width, height, selectedCounty, setSelectedCounty }) => {
  const { isMobile } = useMobileDetect();
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(isMobile ? MAX_DEFAULT_MOBILE_ZOOM : 1);
  const [center, setCenter] = useState([-97, 37]);
  const classes = useStyles();
  const [hoveredData, setHoveredData] = useState();
  if (!countyDataDict || Object.keys(countyDataDict).length < 10) {
    return null;
  }

  useEffect(() => {
    if (!selectedCounty) {
      handleResetClick();
    }
  }, [selectedCounty])

  useEffect(() => {
    setMaxZoom(isMobile ? MAX_DEFAULT_MOBILE_ZOOM : 1);
  }, [isMobile])

  const handleGeographyClick = (geography, projection, path, countyData) => {
    const centroid = projection.invert(path.centroid(geography));
    const longitudeSkewedLeft = centroid.length == 2 && centroid[0] + 1;
    const newCentroid = centroid.length == 2 && geography.id != '15001' ? [longitudeSkewedLeft, centroid[1]] : centroid; // Hawaii for some reason was breaking when skewing left
    setSelectedCounty(countyData);
    setCenter(newCentroid);
    setZoom(SELECTED_COUNTY_ZOOM);
    setMinZoom(SELECTED_COUNTY_ZOOM);
    setMaxZoom(SELECTED_COUNTY_ZOOM);
    logEvent(consts.logCategories.exploring, consts.logActions.selectCounty, countyData.name );
  };

  const handleResetClick = () => {
    setSelectedCounty(null);
    setCenter([-97, 37])
    setZoom(1);
    setMinZoom(1);
    setMaxZoom(isMobile ? MAX_DEFAULT_MOBILE_ZOOM : 1);
  }

  function handleZoomIn() {
    const newZoom = minZoom * 2 > SELECTED_COUNTY_ZOOM ? SELECTED_COUNTY_ZOOM : minZoom * 2;
    setMinZoom(newZoom);
    setMaxZoom(newZoom);
    setZoom(newZoom)
  }

  function handleZoomOut() {
    const newZoom = minZoom / 2 < 1 ? 1 : minZoom / 2;
    setMinZoom(newZoom);
    setMaxZoom(newZoom);
    setZoom(newZoom);
  }

  function handleMoveEnd(position) {
    console.log(position);
    setCenter(position.coordinates);
    setZoom(position.zoom)
  }

  let strokeBase = selectedCounty ? "black" : "#EEE";
  let opacityBase = selectedCounty ? 0.4 : 1;
  let strokeWidthBase = selectedCounty ? 0.1 : 0.25;

  return (
    <>
      <ComposableMap
        data-tip="" // this allows react-tooltip to figure out when to show the tooltip
        id={consts.domNodeIds.countyMap}
        projection="geoAlbersUsa"
        width={width}
        height={width*0.7}
        projectionConfig={{
          scale: width * 1.3,
          rotation: [-11, 0, 0],
        }}
      >
        {/* <rect
          width={consts.countyMapDimensions.width}
          height={consts.countyMapDimensions.height}
          fill="white"
        /> */}
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          onMoveEnd={isMobile ? () => {} : handleMoveEnd}
        >
          <Geographies geography={geos}>
            {({ geographies, projection, path }) => 
              geographies.map((geo) => {
                const cur = countyDataDict[geo.id];
                // TODO - this might be bad for performance.  Consider filtering down countyDataDict instead
                const doesMeetCriteria = cur && meetsCriteria(cur);
                const isSelected = cur && selectedCounty && geo.id == selectedCounty[consts.dbFields.fipsCode];
                let stroke, strokeWidth, opacity, hoveredOpacity;

                if (isSelected) {
                  strokeWidth = 0.75;
                  opacity = 1;
                  hoveredOpacity = 0.9;
                  stroke = 'black';
                } else if (doesMeetCriteria) {
                  strokeWidth = strokeWidthBase;
                  opacity = opacityBase;
                  hoveredOpacity = 0.5;
                  stroke = zoom == 1 ? getColor(cur[colorField]) : consts.colors.veryLightGrey;
                } else if (!doesMeetCriteria && zoom > 1 && !selectedCounty) {
                  strokeWidth = 0.25;
                  stroke = consts.colors.veryLightGrey;
                } else {
                  strokeWidth = selectedCounty ? 0 : 1;
                  opacity = 1;
                  hoveredOpacity = 1;
                }
                return (
                  <Geography
                    key={geo.rsmKey}
                    fill={doesMeetCriteria ? getColor(cur[colorField]) : "#EEE"}
                    geography={geo}
                    onMouseEnter={() => {
                      if (doesMeetCriteria) {
                        setHoveredData(cur);
                      } else {
                        setHoveredData(null);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredData(null);
                    }}
                    onClick={() => {
                      if (doesMeetCriteria) {
                        handleGeographyClick(geo, projection, path, cur)
                      }
                    }}
                    style={{
                      default: {
                        outline: "none",
                        stroke: stroke,
                        strokeWidth: strokeWidth,
                        opacity: opacity,
                      },
                      hover: {
                        outline: "none",
                        strokeWidth: strokeWidth,
                        stroke: stroke,
                        opacity: hoveredOpacity,
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

        </ZoomableGroup>
      </ComposableMap>
      {selectedCounty && (
        <Box position="absolute" top={30} left={20}>
          <IconButton
            aria-label="upload picture"
            component="span"
            onClick={handleResetClick}
            className={classes.button}
          >
            <ZoomOutMapIcon />
          </IconButton>
        </Box>
      )}
      {!isMobile && !selectedCounty && (
        <Box>
          <Box position="absolute" top={30} left={20}>
            <IconButton
              aria-label="upload picture"
              component="span"
              onClick={handleZoomIn}
              className={classes.button}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Box position="absolute" top={70} left={20}>
            <IconButton
              aria-label="upload picture"
              component="span"
              onClick={handleZoomOut}
              className={classes.button}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      {!isMobile && (
        <ReactTooltip
          className='tooltip'
        >
            {!!hoveredData && (
              <Box>
                <Box paddingX={1} paddingTop={1} paddingBottom={2}>
                  <Box >
                    <Typography variant="h5" >{`${hoveredData.name}, ${hoveredData.stateabbreviation}`}</Typography>
                  </Box>
                </Box>
                {!!hoveredData.top_cities && (
                  <Box paddingX={1}>
                    <Box >
                      <Typography variant="body1" className={classes.bold} display="inline">{"Biggest cities: "}</Typography>
                      <Typography display="inline">{hoveredData.top_cities.join(', ')}</Typography>
                    </Box>
                  </Box>
                )}
                <Box paddingX={1} paddingY={4}>
                  <Box >
                    <Typography variant="caption">{"Click to learn more"}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
        </ReactTooltip>
      )}
    </>
  );
};

export default CountyMap;
