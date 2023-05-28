import { Box, Card, CardActionArea, CardContent, Chip, Typography, Button } from '@material-ui/core';
import BarChart from 'components/visualizations/BarChart';
import NivoScatter from 'components/visualizations/NivoScatter';
import consts from 'const';
import { useState, useMemo, useEffect } from 'react';
import CountyDetailsMap from 'components/visualizations/CountyDetailsMap';
import {prettyNumberFormat, prettyUrlEncode} from 'utils';
import dynamic from 'next/dynamic'
import axios from 'axios';
import CitySection from './CitySection';
import Link from 'next/link';
import { makeStyles } from '@material-ui/styles';
import Grow from '@material-ui/core/Grow';
import CityCard from 'components/CityCard';
import useMobileDetect from 'hooks/useMobileDetect';

const HEIGHT_PER_BAR = 25;

const CitiesBreakdownSection = ({
  county,
  geoJson,
  cities,
  containerWidth
}) => {
  const [hoveredCity, setHoveredCity] = useState();
  const { isMobile } = useMobileDetect();
  const CitiesMap = useMemo(() => dynamic(
    () => import('components/visualizations/CitiesMap'), 
    { 
      loading: () => (
        <Box
          width={containerWidth}
          height={500}
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="gray"
        >
          <Typography>
            Loading map...
          </Typography>
        </Box>
      ),
      ssr: false
    }
  ), [containerWidth])

  return (
    <Box>
      <Typography variant="h1">{`Cities and towns in ${county.name}, ${county.stateabbreviation}`}</Typography>
      <Box
        paddingTop={6}
        paddingBottom={6}
        display="flex"
        flexWrap={isMobile ? "nowrap" : "nowrap"}
        overflow="scroll"
      >
        {cities
          .sort((a, b) => b.population - a.population)
          .map((city, index) => {
            return (
                <CityCard
                  key={city.city_name}
                  city={city}
                  isHovered={city == hoveredCity}
                  setIsHovered={(city) => setHoveredCity(city)}
                  initialLoadTime={index * 100}
                />
            )}
        )}
      </Box>
      <Box >
        <CitiesMap
          cities={cities}
          width={containerWidth}
          selectedCity={hoveredCity}
          zoom={null}
          county={county}
          geoJson={geoJson}
        />
      </Box>
      <Box paddingTop={10}>
      </Box>

    </Box>
  )
}

export default CitiesBreakdownSection;