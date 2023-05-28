import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import consts from 'const';
import { setRouteParams } from 'utils';

const styles = {
  //style for font size
  resize:{
    fontSize:12
  },
}

const ScatterDropDown = (props) => {
  const { classes, xAxisField } = props;
  const router = useRouter();

  const handleChange = (event) => {
    const newQuery = {
      ...router.query,
      [consts.filters.xAxis.urlKey]: event.target.value
    }
    setRouteParams(newQuery, router);
  };

  return(
    <TextField
      select
      size='small'
      SelectProps={{ value: xAxisField, onChange: handleChange }}
      value={xAxisField}
      InputProps={{
        classes: {
          input: classes.resize,
        },
      }}
    >
      <MenuItem value={consts.filters.pctAdultsBA.urlKey}>{consts.filters.pctAdultsBA.friendlyName}</MenuItem>
      <MenuItem value={consts.filters.taxBurden.urlKey}>{consts.filters.taxBurden.friendlyName}</MenuItem>
      <MenuItem value={consts.filters.heatIndex.urlKey}>{consts.filters.heatIndex.friendlyName}</MenuItem>
      <MenuItem value={consts.filters.winterTemp.urlKey}>{consts.filters.winterTemp.friendlyName}</MenuItem>
      <MenuItem value={consts.filters.medianAge.urlKey}>{consts.filters.medianAge.friendlyName}</MenuItem>
      <MenuItem value={consts.filters.testScores.urlKey}>{consts.filters.testScores.friendlyName}</MenuItem>
      <MenuItem value={"Politics - % democrat 2020"}>Politics - % Democrat</MenuItem>
    </TextField>
  ) 
}

export default withStyles(styles)(ScatterDropDown);