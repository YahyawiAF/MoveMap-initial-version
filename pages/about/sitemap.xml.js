//pages/sitemap.xml.js
import { prettyUrlEncode } from 'utils';
import prisma from 'lib/client';
import consts from 'const';

const BASE_URL = consts.baseUrl;

function generateSiteMap(data) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${BASE_URL}/quiz</loc>
     </url>
     <url>
       <loc>${BASE_URL}/explore/us</loc>
     </url>
     <url>
       <loc>${BASE_URL}/about/data</loc>
     </url>
     ${data
       .map(({ city, state, county }) => {
         let url = `${BASE_URL}/explore/us/${state}/${county}`;
         if (city) {
           url += `/${city}`
         }
         return `
       <url>
           <loc>${url}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const counties = await prisma.combined_county_data.findMany();
  const countyStatePairs = counties.map((county) => (
    { 
      state: prettyUrlEncode(county.stateabbreviation),
      county: prettyUrlEncode(county.name)
    }
  ))

  const cities = await prisma.combined_city_data.findMany();

  const cityCountyStateTriads = cities.map((city) => (
    {
      state: prettyUrlEncode(city.state_abbreviation),
      county: prettyUrlEncode(city.county),
      city: prettyUrlEncode(city.city_name),
    }
  ))

  // We generate the XML sitemap with the county and city data
  const sitemap = generateSiteMap([...countyStatePairs, ...cityCountyStateTriads])

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap