import React, { useState, useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useRouter } from 'next/router';
import { Grid, Typography } from '@material-ui/core';
import { setRouteParams } from 'utils';
import { useLoading } from "lib/LoadingContext";
import consts from 'const';

export default function ShowMeDropdown() {
  const [currentValue, setCurrentValue] = useState();
  const router = useRouter();
  const { setLoading } = useLoading();

  useEffect(() => {
    setCurrentValue("")
  }, [router.query])

  const handleChange = (event) => {
    const value = event.target.value;
    setCurrentValue(value);
    const newQuery = consts.showMeOptions[value].urlQueryParams;
    setRouteParams(newQuery, router, setLoading);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="caption" >Show me counties:</Typography>
      </Grid>
      <Grid item>
        <FormControl>
          <Select
            native
            value={currentValue}
            onChange={handleChange}
            inputProps={{
              name: 'test',
              id: 'test',
            }}
          >
            <option key="" value="">{""}</option>
            {Object.keys(consts.showMeOptions).map(optionKey => {
              const option = consts.showMeOptions[optionKey];
              return <option key={option.value} value={option.value}>{option.friendlyName}</option>
            })
            }
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}