import React, { useState, useEffect } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useRouter } from 'next/router';
import { setRouteParams } from 'utils';
import { useLoading } from "lib/LoadingContext";
import consts from 'const';
import { logEvent } from "utils/analytics";

export default function SwitchFilter({data}) {
  const router = useRouter();
  const { urlKey, options, friendlyName } = data;
  const valueFromQueryParams = router.query[urlKey];
  const [currentValue, setCurrentValue] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const valueFromUrl = router.query[data.urlKey];
    setCurrentValue(!!valueFromUrl);
  }, [router.query])

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setCurrentValue(isChecked);
    const newQuery = {
      ...router.query,
      [urlKey]: consts.defaultUrlTrueValue
    }
    if (!isChecked) {
      delete newQuery[urlKey];
    }
    logEvent(consts.logCategories.exploring, consts.logActions.filter, urlKey, isChecked ? 1 : 0 );
    setRouteParams(newQuery, router, setLoading);
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Switch
            checked={currentValue}
            onChange={handleChange}
            name={friendlyName}
            color="primary"
          />
        }
        label={friendlyName}
      />
    </FormGroup>
  );
}