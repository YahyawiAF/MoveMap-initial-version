import consts from 'const';
import { Box, Typography } from '@material-ui/core';
import { prettyNumberFormat } from 'utils';

export default function Legend({options}) {
  const colors = options.colorScale;
  return (
    <Box display="flex" justifyContent="end" alignItems="center">
      <Box display="flex" flexDirection="column">
        <Typography variant="caption" >{options.friendlyName}</Typography>
        <Box display="flex" justifyContent="end" alignItems="center">
          <Typography variant="caption" >{prettyNumberFormat(options.lowerBound, true, true)}</Typography>
          <Box paddingX={1} display="flex" justifyContent="center" alignItems="center">
            {colors.map(color => {
              return (
                <Box width={8} height={10} bgcolor={color} key={color}>
                </Box>
              )
            })}
          </Box>
          <Typography variant="caption">{prettyNumberFormat(options.upperBound, true, true)}</Typography>
        </Box>
      </Box>
    </Box>
  );
}