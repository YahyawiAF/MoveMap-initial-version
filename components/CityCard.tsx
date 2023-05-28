import { Box, Card, CardActionArea, Typography, Link as MUILink } from '@material-ui/core';
import Link from 'next/link';
import {prettyNumberFormat, prettyUrlEncode} from 'utils';
import { makeStyles } from '@material-ui/styles';
import { useEffect, useState } from 'react';
import Grow from '@material-ui/core/Grow';
import { logEvent } from "utils/analytics";
import consts from 'const';

const useStyles = makeStyles((theme) => ({
  noUnderline: {
    textDecoration: 'none',
  }
}));


const CityCard = ({city, isHovered, setIsHovered, initialLoadTime}) => {
  const classes = useStyles();
  const href = `/explore/us/${prettyUrlEncode(city.state_abbreviation)}/${prettyUrlEncode(city.county)}/${prettyUrlEncode(city.city_name)}`;

  const logClick = () => {
    logEvent(consts.logCategories.exploring, consts.logActions.clickCity, city.city_name );
  }

  return (
    <Box
      key={city.city_name}
      minWidth={180}
      maxWidth={240}
      paddingX={1}
    >
      <Link href={href} passHref>
        <MUILink>
          <Card
            variant="outlined"
            onMouseOver={()=> setIsHovered(city) }
            onMouseLeave={()=> setIsHovered(null) }
          >
            <CardActionArea onClick={logClick}>
              <Box paddingX={4} paddingTop={4} paddingBottom={4}>
                <Box>
                  <Typography variant="h5">
                    {city.city_name}
                  </Typography>
                </Box>
                {city.population &&
                  <Box paddingTop={2}>
                    <Typography variant="subtitle2">
                      {`Population: ${prettyNumberFormat(city.population,true, false) }`}
                    </Typography>
                  </Box>}
                  {city.latesthomeprice &&
                  <Box>
                    <Typography variant="subtitle2">
                      {`Home price: ${prettyNumberFormat(city.latesthomeprice,true, true) }`}
                    </Typography>
                  </Box>}
              </Box>
            </CardActionArea>
          </Card>
        </MUILink>
      </Link>
    </Box>
  )
}

export default CityCard;
