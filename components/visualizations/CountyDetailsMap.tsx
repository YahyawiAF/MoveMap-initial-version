import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import geos from "public/resources/mapping/counties-10m.json";


// const geoUrl =
//   "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const markers = [
  {
    markerOffset: -30,
    name: "Buenos Aires",
    coordinates: [-122.339722222, 47.756388888]
  },
];


const CountyDetailsMap = () => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);


  const handleGeographyClick = (geography, projection, path) => event => {
    const centroid = projection.invert(path.centroid(geography));
    setCenter(centroid);
    setZoom(10);
  };

  return (
    <ComposableMap projection="geoAlbersUsa"
    >
      <ZoomableGroup center={center} zoom={zoom}>

      <Geographies
        geography={geos}
      >
        {({ geographies, projection, path }) =>
          geographies
            .filter(d => {
              return d.id === "53033"
            })
            .map(geo => {
              return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                onClick={handleGeographyClick(geo, projection, path)}
              />
            )})
        }
      </Geographies>

      {markers.map(({ name, coordinates, markerOffset }) => (
        <Marker key={name} coordinates={coordinates}>
          <g
            fill="none"
            stroke="#FF5533"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(-12, -24)"
          >
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
          </g>
          <text
            textAnchor="middle"
            y={markerOffset}
            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
          >
            {name}
          </text>
        </Marker>
      ))}
      </ZoomableGroup>

    </ComposableMap>
  );
};

export default CountyDetailsMap;