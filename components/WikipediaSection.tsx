import { Box, Chip, Typography, Paper, ImageList, ImageListItem, Link } from '@material-ui/core';
import Image from 'components/Image';
import useMobileDetect from 'hooks/useMobileDetect';

const WikipediaSection = ({ wikipediaData }) => {
  if (!wikipediaData || Object.keys(wikipediaData).length == 0) {
    return null
  }
  const { isMobile } = useMobileDetect();
  const heroImageUrl = wikipediaData?.original?.source;
  const numImagesToShow = isMobile ? 4 : 9
  return (
    <Box paddingBottom={0}>
      <Box display={isMobile ? "block" : "flex"} paddingBottom={0} >
        {!!heroImageUrl && <Box width={isMobile ? "100%" : "50%"} marginBottom={10} paddingRight={isMobile ? 0 : 10}>
          <Image
            src={`${heroImageUrl}`}
            width={"100%"}
            height={"400px"}
          />
        </Box>}
        <Box width={isMobile ? "100%" : "50%"} paddingRight={10} paddingBottom={10}>
          <Typography>{`${wikipediaData.extract}`}</Typography>
          <Link href={wikipediaData.canonicalurl} target="_blank" color="secondary">
            <Typography>{'wikipedia'}</Typography>
          </Link>
        </Box>
      </Box>
      {wikipediaData.images && wikipediaData.images.length >= 3 &&
      <ImageList cols={isMobile ? 1 : 3} rowHeight={isMobile ? 400 : 164}>
        {wikipediaData.images
        .slice(0, numImagesToShow)
        .map((image) => {
          return (
            <ImageListItem key={image.url}>
              <img
                src={`${image.url}`}
                srcSet={`${image.url}`}
                alt={'test'}
                loading="lazy"
              />
            </ImageListItem>
          )})}
        </ImageList>
        }
  </Box>
  )
};

export default WikipediaSection;
