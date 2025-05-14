import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const INDONESIA_GEOJSON_URL = "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province.json";

export default function IndonesiaMap() {
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [geoData, setGeoData] = useState(null);

  const handleProvinceClick = (feature) => {
    const provinceName = feature.properties.propinsi;
    setSelectedProvinces((prev) => {
      if (prev.includes(provinceName)) {
        return prev.filter((name) => name !== provinceName);
      }
      if (prev.length < 2) {
        return [...prev, provinceName];
      }
      return [prev[1], provinceName];
    });
  };

  const onEachProvince = (feature, layer) => {
    layer.on({
      click: () => handleProvinceClick(feature),
    });
    layer.setStyle({
      color: "#555",
      fillColor: selectedProvinces.includes(feature.properties.propinsi) ? "#f87171" : "#60a5fa",
      fillOpacity: 0.7,
      weight: 1,
    });
  };

  const fetchGeoData = async () => {
    const response = await fetch(INDONESIA_GEOJSON_URL);
    const data = await response.json();
    setGeoData(data);
  };

  useEffect(() => {
    fetchGeoData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Indonesia Provinces Map</h1>
      <MapContainer
        center={[-2, 118]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "600px", width: "100%" }}
        zoomControl={false}
        dragging={true}
        doubleClickZoom={false}
        attributionControl={false}
      >
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachProvince} />} 
      </MapContainer>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Selected Provinces:</h2>
        <ul className="list-disc list-inside">
          {selectedProvinces.map((province, index) => (
            <li key={index}>{province}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
