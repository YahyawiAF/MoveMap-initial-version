import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Icon, Box } from '@material-ui/core';
import consts from 'const';
import { prettyNumberFormat } from 'utils';

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 600
  }
}));

export default function TooltipContents({ data }) {
  const classes = useStyles();

  const metroArea = data.metropolitanArea;
  const isMetro = data.isMetroArea;

  return (
    <Grid container spacing={1} direction="column">
      <Grid item container spacing={3} direction="column">
        {isMetro && 
          <Grid item>
            <Typography className={classes.bold}>{`metro: ${metroArea}`}</Typography>
          </Grid>
        }
        <Grid item>
        </Grid>
      </Grid>
      {Object.keys(consts.filters).map(key => {
        const filter = consts.filters[key];
        const value = data[filter.csvKey];
        let formattedValue;

        if (filter.compareMode == consts.compareModes.boolean) {
          formattedValue = !value || value == 0 ? 'no' : 'yes';
        } else if (filter.compareMode === consts.compareModes.singleChoice) {
          formattedValue = value;
        } else if (filter.compareMode === consts.compareModes.multipleChoiceMappedToValues ) {
          const matchingOption = filter.options.find((option) => value > option.minimumValue && value < option.maximumValue )
          formattedValue = matchingOption && matchingOption.name;
        } else {
          formattedValue = typeof value == 'number' ? prettyNumberFormat(value, true, filter.format == consts.metricFormats.CURRENCY, filter.format == consts.metricFormats.PERCENTAGE) : value;
        }

        if (!formattedValue || typeof formattedValue == 'boolean') {
          return null;
        }
        return (formattedValue &&
          <Box display="flex" alignItems="center" key={key} paddingY={1}>
            {filter.iconKey ? <Icon>{filter.iconKey}</Icon> : null}
            <Box marginRight={2}/>
            <Typography className={classes.bold} display="inline">{`${filter.friendlyName}:  `}</Typography>
            &nbsp;
            <Typography display="inline" >{` ${formattedValue}`}</Typography>
          </Box>
        )
      })}
    </Grid>
  );
}