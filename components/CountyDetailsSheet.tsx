import { Box, Typography, Button, Card, CardActionArea, IconButton } from "@material-ui/core"
import Link from 'next/link';
import TooltipContents from "./TooltipContents";
import { makeStyles } from '@material-ui/core/styles';
import consts from 'const';
import {prettyNumberFormat, prettyUrlEncode, getCountyDetailsUrl } from 'utils';
import { Close } from "@material-ui/icons";
import { logEvent } from "utils/analytics";

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 600
  },
  noUnderline: {
    textDecoration: 'none',
  }
}));

const CountyDetailsSheet = ({ selectedCounty, setSelectedCounty }) => {
  const classes = useStyles();
  if (!selectedCounty) {
    return null;
  }
  const metroArea = selectedCounty.metropolitanarea;
  const isMetro = !!selectedCounty.ismetroarea;

  const getMetricsPair = (label, metric) => {
    return (
      <Box>
        <Typography display="inline" className={classes.bold}>{`${label}: `}</Typography>
        <Typography display="inline">{`${metric}`}</Typography>
      </Box>
    )
  }
  const href = getCountyDetailsUrl(selectedCounty);

  const logClick = () => {
    logEvent(consts.logCategories.exploring, consts.logActions.goToCountyPage, selectedCounty.name );

  }

  return (
    <Card
      variant="outlined"
    >
        <Box paddingBottom={4}>
          <Box>
            <Box display="flex" justifyContent="end" paddingRight={2} paddingTop={2}>
              <IconButton aria-label="close" component="span" onClick={() => setSelectedCounty()}>
                <Close />
              </IconButton>
            </Box>
            <Link href={href}>
              <a target='_blank' style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardActionArea onClick={logClick}>
                  <Box paddingBottom={2}>
                    <Box paddingX={4} paddingTop={2} paddingBottom={2}>
                      <Box paddingBottom={1}>
                        <Typography variant="h3" >{`${selectedCounty.name}, ${selectedCounty.state}`}</Typography>
                      </Box>
                      {isMetro &&
                        <Box>
                          <Typography>{`Metro: ${metroArea}`}</Typography>
                        </Box>
                      }
                    </Box>
                    <Box paddingX={4}>
                      <Box >
                        <Typography display="inline" className={classes.bold} >{'Top cities: '}</Typography>
                        <Typography display="inline">{selectedCounty.top_cities.join(', ')}</Typography>
                      </Box>
                      {getMetricsPair(
                        consts.filters.homePrice.friendlyName,
                        prettyNumberFormat(selectedCounty[consts.filters.homePrice.csvKey], true, true)
                      )}
                      {getMetricsPair(
                        consts.filters.rentPrice.friendlyName,
                        prettyNumberFormat(selectedCounty[consts.filters.rentPrice.csvKey], true, true)
                      )}
                    </Box>
                  </Box>
                </CardActionArea>
              </a>
            </Link>
            <Box paddingX={4} paddingTop={2}>
              <Link href={href}>
                <a target='_blank' style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="secondary" style={{textTransform: 'none'}} onClick={logClick}>
                    <Typography variant="caption" className={classes.noUnderline}>Learn more</Typography>
                  </Button>
                </a>
              </Link>
            </Box>
          </Box>
          {/* <TooltipContents data={selectedCounty}/> */}
        </Box>
    </Card>
  )
}

export default CountyDetailsSheet;
