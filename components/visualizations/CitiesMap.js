import { Box, IconButton, Typography, Link as MUILink } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import Link from 'next/link';
import { prettyNumberFormat, prettyUrlEncode } from 'utils';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { makeStyles } from '@material-ui/core/styles';

const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 600
  }
}));


function style(feature) {
  return {
    fillColor: "transparent",
    weight: 3,
    opacity: 0.5,
    color: "black",
  };
}

const CitiesMap = ({
  cities,
  width,
  selectedCity,
  zoom,
  county,
  geoJson
}) => {
  const classes = useStyles();
  const longitudes = cities.map(city => city.longitude);
  const latitudes = cities.map(city => city.latitude);

  const avgLongitude = average(longitudes);
  const minLongituide = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes)
  const avgLatitude = average(latitudes);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  if (!avgLatitude || !avgLongitude) {
    return null;
  }

  const bounds = [
    [minLatitude, minLongituide || 0.0],
    [maxLatitude || 0.0, maxLongitude || 0.0],
  ];

  const height = Math.min(width/2, 500);

  return (
    <Box>
      <MapContainer center={[avgLatitude, avgLongitude]} zoom={zoom} bounds={zoom ? null : bounds} boundsOptions={{padding: [50, 50]}} scrollWheelZoom={false} style={{height: height, width: width *.95}}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          {geoJson && (
            <GeoJSON data={geoJson} style={style} />
          )}
        { cities.map(city => {
          if (!city.latitude || !city.longitude) {
            return null;
          }
          return (
            <Marker
              key={`${city.city_name}, ${city.latitude}, ${city.longitude}`}
              position={[city.latitude, city.longitude]}
              eventHandlers={{
              }}
              opacity={!selectedCity || selectedCity.city_name == city.city_name ? 1 : 0.3}
            >
              <Popup>
                <Link href={`/explore/us/${prettyUrlEncode(city.state_abbreviation)}/${prettyUrlEncode(city.county)}/${prettyUrlEncode(city.city_name)}`} passHref>
                  <MUILink>
                    <Typography variant="h1" >
                      {`${city.city_name}`} <br/>
                    </Typography>
                  </MUILink>
                </Link>
                <Box paddingTop={2}>
                  <Typography display="inline" className={classes.bold}>Population: </Typography>
                  <Typography display="inline">{prettyNumberFormat(city.population, true)} </Typography>
                </Box>
                <Box>
                  <Typography display="inline"className={classes.bold}>Typical home price: </Typography>
                  <Typography display="inline">{prettyNumberFormat(city.latesthomeprice, true, true)}</Typography>
                </Box>
              </Popup>
            </Marker>
          )

        })}

      </MapContainer>
    </Box>
  )
}

export default CitiesMap;
