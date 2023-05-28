import { Box, Container, ThemeProvider, CssBaseline, Typography, Grid, Breadcrumbs } from '@material-ui/core';
import TooltipContents from 'components/TooltipContents';
import LineChart from 'components/visualizations/LineChart';
import CitiesBreakdownSection from 'components/CitiesBreakdownSection'
import consts from 'const';
import { useState, useEffect } from 'react';
import axios from 'axios';
import WikipediaSection from './WikipediaSection';
import BreadcrumbsSection from './BreadCrumbsSection';
import {prettyUrlEncode} from 'utils';
import useMobileDetect from 'hooks/useMobileDetect';

const CountyDetails = ({
  matchedCounty,
  containerDimensions,
  countyHomeValues,
  cities,
  geoJson
}) => {
  const [wikipediaData, setWikipediaData] = useState(null);
  const { isMobile } = useMobileDetect();
  const lineChartData = [
    {
      id: matchedCounty.name,
      color: consts.logoColors.veryDarkBlue,
      data: countyHomeValues.map(item => {
          return {
            x: item.date,
            y: item.value,
          }
        })
    }
  ];

  useEffect(() => {
    setWikipediaData(null);
    axios.get(`/api/wikipedia`, {
      params:
      {
        wikidataid: matchedCounty.wikidataid,
      }
    })
      .then(result => {
        setWikipediaData(result.data)}
      )
      .catch(error => console.log(error))
  }, [])

  

  return (
    <Box>
      <BreadcrumbsSection
        breadCrumbData={[
          {label: 'US', link: '/explore/us'},
          {
            label: `${matchedCounty.name}, ${matchedCounty.state}`,
            link: `/explore/us/${prettyUrlEncode(matchedCounty[consts.dbFields.stateAbbreviation])}/${prettyUrlEncode(matchedCounty[consts.dbFields.name])}`},
        ]}
      />
      {cities && cities.length >= 1 &&
        <CitiesBreakdownSection
          county={matchedCounty}
          cities={cities}
          containerWidth={containerDimensions.width}
          geoJson={geoJson}
      />}
      <Grid container spacing={2}>
        {isMobile && <Grid item xs={12} sm={6}>
          <Typography variant="h1" >{`Quick facts about ${matchedCounty.name}, ${matchedCounty.stateabbreviation}`}</Typography>
          <TooltipContents data={matchedCounty}/>
        </Grid>}
        <Grid item xs={12} sm={6}>
          {lineChartData[0].data.length > 0 && (
            <Box height={460} paddingBottom={10} paddingRight={isMobile ? 0 : 10}>
              <Typography variant="h1">{`Home price trend in ${matchedCounty.name}, ${matchedCounty.stateabbreviation}`}</Typography>
              <Typography variant="caption" >{`Data from `}</Typography>
              <a href={`https://www.zillow.com/${matchedCounty.name.replace(' ', '-')}-${matchedCounty.stateabbreviation}`} target='_blank'>
                <Typography variant="caption" >{`Zillow`}</Typography>
              </a>
              <LineChart 
                data={lineChartData}
              />
            </Box>
          )}
        </Grid>
        {!isMobile && <Grid item xs={12} sm={6}>
          <Typography variant="h1" >{`Quick facts about ${matchedCounty.name}, ${matchedCounty.stateabbreviation}`}</Typography>
          <TooltipContents data={matchedCounty}/>
        </Grid>}
      </Grid>
    <Box paddingTop={20}>
      {wikipediaData && <WikipediaSection wikipediaData={wikipediaData} />}
    </Box>
    </Box>
  )
}

export default CountyDetails;