import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { COUNTRIES_DATA } from "../../_data/countries_data";
import HEX_DATA from "../../_data/countries_hex_data.json";
import Globe from "react-globe.gl";

const getRandomCountry = () => {
  return COUNTRIES_DATA[Math.floor(Math.random() * COUNTRIES_DATA.length)];
};

export default function CustomGlobe() {
  const globeEl = useRef();
  const country = getRandomCountry();
  const [selectedCountry, setSelectedCountry] = useState({
    lat: country.latitude,
    lng: country.longitude,
    label: country.name
  });
  const [hex, setHex] = useState({ features: [] });
  const [clickedCountry, setClickedCountry] = useState(null);

  useEffect(() => {
    setHex(HEX_DATA);
  }, []);

  useEffect(() => {
    // globeEl.current.controls().autoRotate = true;
    // globeEl.current.controls().autoRotateSpeed = 0.2;

    const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };
    globeEl.current?.pointOfView(MAP_CENTER, 0);
  }, [globeEl]);

  useEffect(() => {
    const countryLocation = {
      lat: selectedCountry.lat,
      lng: selectedCountry.lng,
      altitude: 1.5
    };

    globeEl.current?.pointOfView(countryLocation, 0);
  }, [selectedCountry]);

  const handleCountryClick = useCallback(({ properties }) => {
    const country = COUNTRIES_DATA.find(c => 
      c.name.toLowerCase() === properties.NAME.toLowerCase() ||
      c.name.toLowerCase().includes(properties.NAME.toLowerCase()) ||
      properties.NAME.toLowerCase().includes(c.name.toLowerCase())
    );
    
    if (country) {
      setClickedCountry({
        ...country,
        properties: properties
      });
      
      setSelectedCountry({
        lat: country.latitude,
        lng: country.longitude,
        label: country.name
      });
    }
  }, []);

  const hexColor = useCallback(({ properties }) => {
    // Highlight the clicked country
    if (clickedCountry && 
        (properties.NAME.toLowerCase() === clickedCountry.name.toLowerCase() ||
         properties.NAME.toLowerCase().includes(clickedCountry.name.toLowerCase()) ||
         clickedCountry.name.toLowerCase().includes(properties.NAME.toLowerCase()))) {
      return "#ff8c00"; // Highlighted color for the selected country
    }
    return "#1b66b1"; // Default color
  }, [clickedCountry]);

  return (
    <div className="relative w-full h-screen">
      <Globe
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"
        labelsData={[selectedCountry]}
        labelText={"label"}
        labelSize={1.6}
        labelColor={useCallback(() => "white", [])}
        labelDotRadius={0.4}
        labelAltitude={0.05}
        hexPolygonsData={hex?.features}
        hexPolygonResolution={3} //values higher than 3 makes it buggy
        hexPolygonMargin={0.2}
        hexPolygonColor={hexColor}
        onHexPolygonClick={handleCountryClick}
      />
      
      {clickedCountry && (
        <div className="absolute top-10 right-10 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg max-w-xs">
          <h3 className="text-xl font-bold">{clickedCountry.name}</h3>
          <p className="text-sm mt-2">Latitude: {clickedCountry.latitude.toFixed(4)}</p>
          <p className="text-sm">Longitude: {clickedCountry.longitude.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}
