import { Box, Typography, Slider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { prettyNumberFormat, setRouteParams } from 'utils';
import { useRouter } from 'next/router';
import consts from 'const';
import { useLoading } from "lib/LoadingContext";
import { logEvent } from "utils/analytics";

const SliderFilter = ({ data }) => {
  const { setLoading } = useLoading();
  let sliderInitialValues;
  let isDual = data.compareMode === consts.compareModes.between;
  if (isDual) {
    sliderInitialValues = [data.minValue, data.maxValue]
  } else if (data.compareMode === consts.compareModes.lessThan) {
    sliderInitialValues = data.maxValue;
  } else if (data.compareMode === consts.compareModes.greaterThan) {
    sliderInitialValues = data.minValue;
  }
  
  const [value, setValue] = useState(sliderInitialValues);
  const router = useRouter();

  useEffect(() => {
    const valueFromUrl = router.query[data.urlKey];
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
      } else if (parseFloat(valueFromUrl)) {
        setValue(parseFloat(valueFromUrl))
      }
    } else {
      // if this filter isn't in the url at all, we should set it back to the default (min and max)
      setValue([data.minValue, data.maxValue])
    }
  }, [router.query])

  const handleOnChange = (event, newValue) => {
    setValue(newValue);
  }

  const handleCommittedChange = (event, newValue) => {
    let newQuery = {};
    // if the entire range is selected, we should remove the url param so that we're not filtering out the nulls
    // (since the user intent in this case is "show me everything")
    switch (data.compareMode) {
      case consts.compareModes.lessThan:
        newQuery = {
          ...router.query,
          [data.urlKey]: newValue,
        }
        if (newValue === data.maxValue) {
          delete newQuery[data.urlKey];
        }
        break;
      case consts.compareModes.greaterThan:
        newQuery = {
          ...router.query,
          [data.urlKey]: newValue,
        }
        if (newValue === data.minValue) {
          delete newQuery[data.urlKey];
        }
        break;
      case consts.compareModes.between:
        const lowerValueUnchanged = newValue[0] == data.minValue;
        const upperValueUnchanged = newValue[1] == data.maxValue;
        const urlLowValue = lowerValueUnchanged ? "" : newValue[0];
        const urlHighValue = upperValueUnchanged ? "" : newValue[1];
        newQuery = {
          ...router.query,
          [data.urlKey]: `${urlLowValue}${consts.urlBetweenSymbol}${urlHighValue}`,
        }
        if (lowerValueUnchanged && upperValueUnchanged) {
          delete newQuery[data.urlKey];
        }
        break;
      default:
        break;
    };
    logEvent(consts.logCategories.exploring, consts.logActions.filter, data.urlKey );
    setRouteParams(newQuery, router, setLoading);
  };

  let leftTextValue;
  let leftTextColor = "text.primary";
  let rightTextValue;
  let rightTextColor = "text.primary";
  switch (data.compareMode) {
    case consts.compareModes.lessThan:
      leftTextValue = data.minValue;
      leftTextColor = "text.disabled";
      rightTextValue = value;
      break;
      case consts.compareModes.greaterThan:
        leftTextValue = value;
        rightTextValue = data.maxValue;
        rightTextColor = "text.disabled";
      break;
    case consts.compareModes.between:
      leftTextValue = value[0] || data.minValue;
      rightTextValue = value[1] || data.maxValue;
      break;
    default:
      break;
  };

  const numberFormatter=(value) => prettyNumberFormat(value, true, data.format == consts.metricFormats.CURRENCY, data.format == consts.metricFormats.PERCENTAGE )

  return (
    <Box paddingY={2}>
      <Box>
        <Typography variant="body2" id="range-slider" gutterBottom >
          {data.friendlyName}
        </Typography>
      </Box>
      <Box display="flex" flexGrow={1} >
        <Box width={40}>
          <Typography id="range-slider" gutterBottom component="div" align="right">
            <Box color={leftTextColor}>
              {numberFormatter(leftTextValue)} 
            </Box>
          </Typography>
        </Box>
        <Box flexGrow={1} paddingX={4}>
          <Slider
            min={data.minValue}
            max={data.maxValue}
            onChange={handleOnChange}
            onChangeCommitted={handleCommittedChange}
            valueLabelDisplay="off"
            value={value}
            aria-labelledby="range-slider"
            getAriaValueText={() => numberFormatter(value)}
            valueLabelFormat={() => numberFormatter(value)}
            step={data.step || 1}
            track={data.compareMode == consts.compareModes.greaterThan ? "inverted" : "normal"}
          />
        </Box>
        <Box width={40}>
          <Typography id="range-slider" gutterBottom component="div">
            <Box color={rightTextColor}>
              {numberFormatter(rightTextValue)}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SliderFilter;