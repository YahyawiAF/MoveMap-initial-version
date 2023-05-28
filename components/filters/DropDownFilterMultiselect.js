import React, { useState, useEffect } from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Grid, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import consts from 'const';
import { setRouteParams } from 'utils';
import { useLoading } from "lib/LoadingContext";
import { logEvent } from "utils/analytics";

const MenuProps = {
  getContentAnchorEl: null
};

const DropDownFilterMultiselect = ({ data }) => {
  const [currentValues, setCurrentValues] = useState([]);
  const router = useRouter();
  const { urlKey, options, friendlyName } = data;
  const { setLoading } = useLoading();

  useEffect(() => {
    const valuesFromUrl = router.query[urlKey] && router.query[urlKey].split(consts.urlArrayDelimiter) || [consts.allOption.value];
    if (valuesFromUrl) {
      setCurrentValues(valuesFromUrl);
    } else {
      setCurrentValues([]);
    }
  }, [router.query])

  useEffect(() => {
    const valuesFromUrl = router.query[urlKey] && router.query[urlKey].split(consts.urlArrayDelimiter) || [consts.allOption.value];
    if (valuesFromUrl) {
      setCurrentValues(valuesFromUrl);
    }
  }, [])


  const handleSelectSingle = (selection) => {
    let selectionListForUrl;
    if (currentValues.includes(selection)) {
      selectionListForUrl = [...currentValues].filter(item => item != selection)
    } else {
      selectionListForUrl = [...currentValues, selection].filter(item => item != consts.allOption.value);
    }
    setCurrentValues(selectionListForUrl);
    const newQuery = {
      ...router.query,
      [urlKey]: selectionListForUrl.join(consts.urlArrayDelimiter)
    };
    logEvent(consts.logCategories.exploring, consts.logActions.filter, urlKey );
    setRouteParams(newQuery, router, setLoading);
  }

  const handleSelectAll = () => {
    const urlParamsIncludesAll = !router.query[urlKey] || (router.query[urlKey] && router.query[urlKey] == consts.allOption.value);
    setCurrentValues([consts.allOption.value]);
    if (!urlParamsIncludesAll) {
      let newQuery = {
        ...router.query
      };
      delete newQuery[urlKey];
      logEvent(consts.logCategories.exploring, consts.logActions.filter, urlKey );
      setRouteParams(newQuery, router, setLoading);
    } 
  }

  return(
    <Box paddingY={1}>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="caption" >{friendlyName}</Typography>
        </Grid>
        <Grid item>      
            <Select
              labelId='weather'
              id="weather"
              defaultValue={consts.allOption.name}
              multiple
              value={currentValues}
              renderValue={(selected) => {
                if (!selected || selected == consts.allOption.value) {
                  return consts.allOption.name;
                }
                const selectedOptions = selected.map(selectedValue => options.find(option => option.value === selectedValue));
                if (selectedOptions.length > 1) {
                  return "Multiple";
                } if (selectedOptions.length == 1) {
                  return selectedOptions.map(option => option.name).join(', ');
                } else {
                  return consts.allOption.name;
                }
              }
              }
              MenuProps={MenuProps}
            >
              <MenuItem key={consts.allOption.value} value={consts.allOption.value} onClick={handleSelectAll}>
                <Checkbox checked={currentValues.length == 0 || currentValues.includes(consts.allOption.value)} />
                <ListItemText primary={consts.allOption.name} />
              </MenuItem>

              {options.map((option) => (
                <MenuItem key={option.value} value={option.value} onClick={() => handleSelectSingle(option.value)}>
                  <Checkbox checked={currentValues.includes(option.value)} />
                  <ListItemText primary={option.name} />
                </MenuItem>
              ))}
            </Select>
        </Grid>
      </Grid>
    </Box>
  ) 
}

export default DropDownFilterMultiselect;