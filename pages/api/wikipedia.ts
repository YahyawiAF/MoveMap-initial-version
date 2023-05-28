import axios from "axios"

export default async (req, res) => {
  const wikiDataId = req.query.wikidataid;
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikiDataId}&format=json&props=sitelinks`

  const siteLinksResponse = await axios.get(url);
  const title = siteLinksResponse.data.entities[wikiDataId].sitelinks.enwiki.title;
  const pagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&format=json`;
  const pagesResponse = await axios.get(pagesUrl);
  const pageMetadata = pagesResponse.data.query.pages;
  const pageId = Object.keys(pageMetadata)[0];
  const wikipediaPageDataUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=info|extracts|pageimages|images|pageprops&exintro&explaintext&redirects=1&inprop=url&piprop=original&imlimit=30&pageids=${pageId}`
  const wikipediaPageDataResponse = await axios.get(wikipediaPageDataUrl);

  const pageData = wikipediaPageDataResponse.data.query.pages[pageId];

  let processedImages;

  try {
    processedImages = await Promise.all(pageData.images
      .filter(image => !!image && !!image.title && !image.title.includes('svg'))
      .map(async (image) => {
      const url = `https://www.mediawiki.org/w/api.php?action=query&titles=${encodeURIComponent(image.title)}&prop=imageinfo&iiprop=url&format=json`;
      const imageInfo = await axios.get(url);
      return imageInfo.data.query.pages[-1].imageinfo && imageInfo.data.query.pages[-1].imageinfo[0];
    }))
  } catch (error) {
    // console.log(error);
    // TODO - log errors
  }

  processedImages = processedImages && processedImages.filter(image => !!image && !!image.url && image.url != pageData.original.source && !image.url.includes('svg'));

  const processedPageData = {
    ...pageData,
    images: processedImages
  }

  res.status(200).json( processedPageData )
}