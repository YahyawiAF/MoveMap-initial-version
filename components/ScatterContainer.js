import React, { useState } from "react";
import dynamic from "next/dynamic";
import consts from 'const';
import TooltipContents from 'components/TooltipContents';
import Scatter from 'components/visualizations/Scatter';
import ScatterDropDown from 'components/ScatterDropdown';
import { Box, Typography, withStyles } from '@material-ui/core';

const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
});

const DEFAULT_X_AXIS_URL_KEY = consts.filters.pctAdultsBA.urlKey;

const ScatterContainer = ({
  countyMap,
  maxValues,
  getHomePriceColor,
  meetsCriteria,
  yAxisLabel,
  yAxisCsvKey,
  filterValues,
  scatterWidth,
  scatterHeight,
  xAxisValueFromUrl,
  classes
}) => {
  const [hoveredData, setHoveredData] = useState();
  const xAxisCsvKey = consts.filters[xAxisValueFromUrl]?.csvKey || consts.filters[DEFAULT_X_AXIS_URL_KEY]?.csvKey;

  return (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box display="flex" alignItems="center" justifyContent="center">
      <Typography variant="caption" className={classes.rotated}>{yAxisLabel}</Typography>
      <Scatter
        data={countyMap}
        getColor={getHomePriceColor}
        filterValues={filterValues}
        meetsCriteria={meetsCriteria}
        xAxisField={xAxisCsvKey}
        yAxisField={yAxisCsvKey}
        width={scatterWidth}
        //make room for dropdown
        height={scatterHeight - 40}
        setHoveredData={setHoveredData}
        maxValues={maxValues}
      />
      </Box>
      <ScatterDropDown 
          xAxisField={xAxisValueFromUrl || DEFAULT_X_AXIS_URL_KEY}
      />
      </Box>
      <ReactTooltip className='tooltip'>
          {!!hoveredData && <TooltipContents data={hoveredData}/>}
      </ReactTooltip>
    </Box>
  );
};

export default withStyles({
  rotated: {
    width: 100,
    marginRight: -60,
    transform: 'rotate(-90deg)'
  }
})(ScatterContainer);
