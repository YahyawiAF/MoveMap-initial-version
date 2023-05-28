import { Box, Chip, Typography, Paper, ImageList, ImageListItem, Link, Grid } from '@material-ui/core';
import consts from 'const';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Image from 'components/Image';
import WikipediaSection from './WikipediaSection';
import dynamic from 'next/dynamic'
import BreadcrumbsSection from './BreadCrumbsSection';
import {prettyUrlEncode} from 'utils';
import LineChart from 'components/visualizations/LineChart';
import { logEvent } from "utils/analytics";
import TooltipContents from 'components/TooltipContents';
import useMobileDetect from 'hooks/useMobileDetect';


const amenities = ['Restaurants', 'Coffee shops', 'Schools', 'Grocery stores', 'Parks', 'Bars', 'Libraries', 'Museums', 'Universities'];

const CitySection = (({
  cityData,
  containerWidth,
  homeValues
}) => {
  const [selectedAttraction, setSelectedAattraction] = useState(amenities[0]);
  const [wikipediaData, setWikipediaData] = useState(null);
  const { isMobile } = useMobileDetect();

  useEffect(() => {
    setWikipediaData(null);
    axios.get(`/api/wikipedia`, {
      params:
      {
        wikidataid: cityData.wikidataid,
      }
    })
      .then(result => {
        setWikipediaData(result.data)}
      )
      .catch(error => console.log(error))
  }, [cityData])

  const lineChartData = [
    {
      id: cityData.city_name,
      color: consts.logoColors.veryDarkBlue,
      data: homeValues.map(item => {
          return {
            x: item.date,
            y: item.value,
          }
        })
    }
  ];

  return (
    <Box>
      <BreadcrumbsSection
        breadCrumbData={[
          {label: 'US', link: '/explore/us'},
          {
            label: `${cityData.county}, ${cityData.state_abbreviation}`,
            link: `/explore/us/${prettyUrlEncode(cityData.state_abbreviation)}/${prettyUrlEncode(cityData.county)}`
          },
          {
            label: `${cityData.city_name}`
          },
        ]}
      />
      <Grid container spacing={2}>
        {isMobile && <Grid item xs={12} sm={6}>
          <Typography variant="h1" >{`Quick facts about ${cityData.city_name}, ${cityData.state_abbreviation}`}</Typography>
          <TooltipContents data={cityData}/>
        </Grid>}
        <Grid item xs={12} sm={6}>
          {lineChartData[0].data.length > 0 && (
            <Box height={300} paddingBottom={10} paddingRight={isMobile ? 0 : 10}>
              <Typography variant="h1">{`Home price trend in ${cityData.city_name}, ${cityData.state_abbreviation}`}</Typography>
              <Typography variant="caption" >{`Data from `}</Typography>
              <a href={`https://www.zillow.com/${cityData.city_name.replace(' ', '-')}-${cityData.state_abbreviation}`} target='_blank'>
                <Typography variant="caption" >{`Zillow`}</Typography>
              </a>
              <LineChart 
                data={lineChartData}
              />
            </Box>
          )}
        </Grid>
        {!isMobile && <Grid item xs={12} sm={6}>
          <Typography variant="h1" >{`Quick facts about ${cityData.city_name}, ${cityData.state_abbreviation}`}</Typography>
          <TooltipContents data={cityData}/>
        </Grid>}
      </Grid>
      <Box height={80}/>
      <Box paddingBottom={10}>
        <Box paddingTop={10} paddingBottom={3} display="flex" overflow="scroll">
          {amenities.map(attraction => {
            const isSelected = attraction == selectedAttraction;
            return (
              <Box paddingX={1} key={attraction}>
                <Chip
                  label={attraction}
                  onClick={() => {
                    logEvent(consts.logCategories.exploring, consts.logActions.selectAmenityType, attraction ); 
                    setSelectedAattraction(attraction);
                  }}
                  color={isSelected ? "secondary" : "default"}
                />
              </Box>
            )}
          )}
        </Box>
        <Box paddingY={2}>
          <Typography variant="h1">{`${selectedAttraction} in ${cityData.city_name}, ${cityData.state}`}</Typography>
        </Box>
        <iframe
          width={containerWidth - 20}
          height={Math.min(containerWidth * 0.7, 400)}
          loading="lazy"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBRZbjTAWlc4qOTPanURZnoPLkXl933qN4
            &q=${selectedAttraction} in ${cityData.city_name},+${cityData.state}`}>
        </iframe>
      </Box>
      {wikipediaData && <WikipediaSection wikipediaData={wikipediaData} />}

    </Box>
  )
});

export default CitySection;