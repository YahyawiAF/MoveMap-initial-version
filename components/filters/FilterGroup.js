import { Box, Card, Typography, CardContent, makeStyles } from '@material-ui/core';
import consts from 'const';

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 600
  },
  boxWithUnderline: {
    borderBottom: `1px solid ${consts.colors.veryLightGrey}`
  },
  transparent: {
    backgroundColor: "transparent",
  },
}));

const FilterGroup = ({children, title}) => {
  const classes = useStyles();
  return (
    <Box className={classes.boxWithUnderline}>
      <Box paddingY={4}>
        <Box paddingY={0} paddingX={4}> 
          <Typography variant="h5">{title}</Typography>
        </Box>
        <Box height={8}></Box>
        <Box display="flex" flexDirection="column" paddingX={4}>
          {children}
        </Box>
      </Box>
    </Box>
  )
};

export default FilterGroup;