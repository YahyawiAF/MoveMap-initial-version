import React from 'react';
import { Box, Button, Typography, Snackbar } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { useRouter } from 'next/router';
import consts from 'const';
import { logEvent } from 'utils/analytics';
import CheckIcon from '@material-ui/icons/Check';
import {
  renderSvgToCanvas,
  downloadPngFromCanvas,
  copyCanvasContentsToClipboard,
  copyTextToClipboard
} from 'utils';

const BASE_URL = consts.baseUrl;
export default function ShareButton() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleShare = async (text, shareUrl, svg=null) => {
    const shareDataNoFiles = {
      text,
      url: shareUrl,
    };
    const myNavigator = navigator as any;  // typescript didn't like navigator.canShare, so this is a workaround
    if (!myNavigator.canShare) {
      copyTextToClipboard(shareUrl);
      // copyCanvasContentsToClipboard(mapCanvas, () => console.log('done'), () => console.log('error'))
      // const canvas = await renderSvgToCanvas(svg, consts.domNodeIds.canvasForMapSharing) as HTMLCanvasElement;
      // downloadPngFromCanvas(canvas);
      setOpen(true);
      return;
    }
    if (svg) {
      const canvas = await renderSvgToCanvas(svg, consts.domNodeIds.canvasForMapSharing) as HTMLCanvasElement;
      canvas.toBlob((blob) => {
        const file = new File([blob], "movemap.png", {type: blob.type});
        const shareDataWithFiles = {
          ...shareDataNoFiles,
          files: [file]
        }
        if (myNavigator.canShare(shareDataWithFiles)) {
          myNavigator.share(shareDataWithFiles)
            .then(() => console.log('done'))
            .catch((err) => console.log(err))
        } else if (myNavigator.canShare(shareDataNoFiles)) {
          myNavigator.share(shareDataNoFiles)
            .then(() => console.log('done'))
            .catch((err) => console.log(err))
        } else {
          copyTextToClipboard(shareUrl);
          setOpen(true);
        }
      });
    } else {
      if (myNavigator.canShare(shareDataNoFiles)) {
        navigator.share(shareDataNoFiles)
      } else {
        copyTextToClipboard(shareUrl);
        setOpen(true);
      }
    }
  }


  const handleButtonClick = async () => {
    logEvent(consts.logCategories.sharing, consts.logActions.clickShareButton);
    const shareUrl = `${BASE_URL}${router.asPath}`;
    if (router.pathname == consts.URLS.explorePage) {
      const svg = document.getElementById(consts.domNodeIds.countyMap);
      const text = 'Check out where movemap says I should live next.';
      handleShare(text, shareUrl, svg);
    } else if (router.pathname == consts.URLS.quizPage) {
      const text = `I just took the movemap quiz. Check it out and let me know where you're going to live next!`
      handleShare(text, shareUrl);
    } else if ([consts.URLS.countyPage, consts.URLS.cityPage].includes(router.pathname)) {
      const text = `Movemap tells me I should live here.  What do you think?`
      handleShare(text, shareUrl);
    } else {
      const text = `Check out movemap`;
      handleShare(text, shareUrl);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        style={{textTransform: 'none'}}
        onClick={handleButtonClick}
      >
        <ShareIcon fontSize="small" />
        <Box marginRight={1}/>
        <Typography>
          Share
        </Typography>
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleClose}
        open={open}
        autoHideDuration={3000}
        message="Url copied!"
      >
        <Box
          display="flex"
          padding={4}
          justifyContent="center"
          alignItems="center"
          bgcolor={consts.logoColors.paleBlue}
          borderRadius={10}
        >
          <CheckIcon/>
          <Box marginRight={1}/>
          <Typography color="textPrimary" >
            Url copied to clipboard
          </Typography>

        </Box>
      </Snackbar>
    </Box>
  );
}