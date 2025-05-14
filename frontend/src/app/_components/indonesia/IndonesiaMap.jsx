import { useEffect, useState, useRef } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const INDONESIA_GEOJSON_URL =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province.json";

export default function IndonesiaMap() {
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef();

  const handleProvinceClick = (feature, layer) => {
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

    // Set the clicked style to bright yellow
    layer.setStyle({
      fillColor: "#fde047", // bright yellow
      color: "#facc15",
      weight: 2,
      fillOpacity: 0.9,
    });
  };

  const onEachProvince = (feature, layer) => {
    const provinceName = feature.properties.propinsi;

    layer.on({
      click: () => handleProvinceClick(feature, layer),
    });

    layer.setStyle({
      color: "#444",
      fillColor: selectedProvinces.includes(provinceName)
        ? "#fde047"
        : "#60a5fa", // calm blue for unselected
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
        style={{ height: "600px", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        {/* Use a realistic terrain tile layer */}
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='© OpenTopoMap contributors'
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            onEachFeature={onEachProvince}
            ref={geoJsonRef}
          />
        )}
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
