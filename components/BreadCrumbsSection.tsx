
import Link from 'next/link';
import { Box, Container, ThemeProvider, CssBaseline, Typography, Grid, Breadcrumbs } from '@material-ui/core';
import { Link as MUILink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import consts from 'const';

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 600,
    fontSize: '20px'
  },
  header: {
    zIndex: theme.zIndex.drawer - 1,
  }
}));

const BreadcrumbsSection = ({ breadCrumbData }) => {
  const classes = useStyles();
  const headerHeight=50;
  return (
    <Box>
      <Box
        paddingY={3}
        bgcolor="white"
        className={classes.header}
        paddingLeft={2}
        display="flex"
        alignItems="center"
      >
        <Breadcrumbs aria-label="breadcrumb">
        { breadCrumbData.map((breadcrumb, index) => {
          const isLast = index == breadCrumbData.length - 1;
          return (
            isLast ?
              (<Typography key={breadcrumb.label} className={classes.bold} variant="h1">
                {breadcrumb.label}
              </Typography>)
            :
              (<Link key={breadcrumb.label} href={breadcrumb.link} passHref>
                <MUILink>
                  <Typography key={breadcrumb.label} className={classes.bold} variant="h1">
                    {breadcrumb.label}
                  </Typography>
                </MUILink>
              </Link>)
            )}
          )}
        </Breadcrumbs>
      </Box>
    </Box>
  )
}

export default BreadcrumbsSection;
