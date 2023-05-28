import React from 'react';
import { Box, IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import consts from 'const';
import { useRouter } from 'next/router';
import MoreIcon from '@material-ui/icons/MoreVert';
import ShareButton from 'components/ShareButton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    paddingLeft: 6,
    color: consts.logoColors.veryDarkBlue
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: consts.HEADER_HEIGHT,
    outline: `1px solid ${consts.colors.backgroundGreyOffset}`,
  },
}));

export default function Header({title}) {
  const classes = useStyles();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Box paddingLeft={4}>
            <IconButton aria-label="go home" component="span" onClick={() => router.push('/')}>
              <Image src="/resources/images/logo.png" alt="me" width="40" height="40" />
            </IconButton>
          </Box>
          <Typography variant="h2" className={classes.title}>
            Movemap
          </Typography>
          <ShareButton/>
          <Box marginRight={4}/>
          <IconButton aria-label="display more actions" edge="end" color="inherit" onClick={handleClick}>
            <MoreIcon />
          </IconButton>
          <Menu
            id="nav-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => router.push("/help")}>Get help</MenuItem>
            <MenuItem onClick={() => router.push("/quiz")}>Take the quiz</MenuItem>
            <MenuItem onClick={() => router.push("/about/data")}>About the data</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box height={consts.HEADER_HEIGHT + 10} />
    </div>
  );
}