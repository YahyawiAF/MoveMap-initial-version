import React, { useState, useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { setRouteParams } from 'utils';
import { useLoading } from "lib/LoadingContext";
import { logEvent } from "utils/analytics";
import consts from 'const';


export default function DropDownSingleselect({ data }) {
  const { urlKey, options, optionsOrder, friendlyName } = data;
  const defaultValue = options[optionsOrder[0]].value;
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const router = useRouter();
  const { setLoading } = useLoading();

  useEffect(() => {
    const valueFromUrl = router.query[data.urlKey];
    if (valueFromUrl) {
      setCurrentValue(valueFromUrl);
    } else {
      setCurrentValue(defaultValue);
    }
  }, [router.query])

  const handleChange = (event) => {
    const value = event.target.value;
    setCurrentValue(value);
    const newQuery= {
      ...router.query,
      [urlKey]: value,
    }
    logEvent(consts.logCategories.exploring, consts.logActions.filter, urlKey );

    setRouteParams(newQuery, router, setLoading);
  };

  return (
    <Box paddingY={1}>
      <Box>
        <Typography variant="caption" >{friendlyName}</Typography>
      </Box>
      <Box>
          <Select
            native
            value={currentValue}
            onChange={handleChange}
            inputProps={{
              name: friendlyName,
              id: friendlyName,
            }}
          >
            {optionsOrder.map(optionKey => {
              const option = options[optionKey];
              return <option key={option.value} value={option.value}>{option.name}</option>
            })
            }
          </Select>
      </Box>
    </Box>
  );
}