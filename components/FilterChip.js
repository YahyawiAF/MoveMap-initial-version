import { Box, Typography, Slider, Chip } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { prettyNumberFormat, setRouteParams } from 'utils';
import { useRouter } from 'next/router';
import consts from 'const';
import { useLoading } from "lib/LoadingContext";
import Icon from '@material-ui/core/Icon';
import { logEvent } from "utils/analytics";

const FilterChip = ({ data }) => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [value, setValue] = useState();

  useEffect(() => {
    const valueFromUrl = router.query[data.urlKey];
    if ([consts.compareModes.multipleChoice, consts.compareModes.multipleChoiceMappedToValues].includes(data.compareMode)) {
      setValue(valueFromUrl)
    } else { // all of these values will be ranges
      if (valueFromUrl) {
        const valueFromUrlSplit = valueFromUrl.split(consts.urlBetweenSymbol);
        const isRange = valueFromUrlSplit.length == 2;
        if (isRange) {
          if (data.compareMode === consts.compareModes.between) {
            let lowValue = valueFromUrlSplit[0];
            let highValue = valueFromUrlSplit[1];
            lowValue = parseFloat(lowValue || data.minValue);
            highValue = parseFloat(highValue || data.maxValue);
            setValue([lowValue, highValue]);
          } else {
            setValue(valueFromUrlSplit.map(value => parseFloat(value)))
          }
        } else if (valueFromUrl.includes('.')) {
          setValue(parseFloat(valueFromUrl))
        } else {
          setValue(valueFromUrl);
        }
      } else {
        setValue(valueFromUrl);
      }
    }
  }, [router.query])

  const numberFormatter=(value) => prettyNumberFormat(value, true, data.format == consts.metricFormats.CURRENCY, data.format == consts.metricFormats.PERCENTAGE )

  if (!value) {
    return null
  }

  let label;
  switch (data.compareMode) {
    case consts.compareModes.lessThan:
      label = `${numberFormatter(data.minValue)} - ${numberFormatter(value)}`;
      break;
    case consts.compareModes.greaterThan:
      label = `${numberFormatter(value)} - ${numberFormatter(data.maxValue)}`;
      break;
    case consts.compareModes.between:
      label = `${numberFormatter(value[0] || data.minValue)} - ${numberFormatter(value[1] || data.maxValue)}`;
      break;
    case consts.compareModes.singleChoice:
      label = data.options[value]?.name
      break;
    case consts.compareModes.multipleChoice:
    case consts.compareModes.multipleChoiceMappedToValues:
      if (!value) {
        label = value
      } else {
        const values = value.split(consts.urlArrayDelimiter);
        if (values?.length > 1) {
          label = 'multiple'
        } else {
          const option = data.options.find(option => option.value == value);
          label = option?.name;
        }
      }
      break;
    default:
      break;
  };

  const removeFilter = () => {
    const newQuery = router.query;
    delete newQuery[data.urlKey];
    logEvent(consts.logCategories.exploring, consts.logActions.removeFilter, data.urlKey )
    setRouteParams(newQuery, router, setLoading)
  }

  return (
    <Box marginRight={1} marginTop={2}>
      <Chip
        label={label} 
        onDelete={removeFilter}
        icon={data.iconKey ? <Icon>{data.iconKey}</Icon> : null}
      />

    </Box>
  )
}

export default FilterChip;