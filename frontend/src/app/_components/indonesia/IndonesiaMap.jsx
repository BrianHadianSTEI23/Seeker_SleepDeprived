import { useEffect, useState, useRef } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const INDONESIA_GEOJSON_URL =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/refs/heads/master/indonesia.geojson";
const CITY_GEOJSON_URL = "https://raw.githubusercontent.com/okzapradhana/indonesia-city-geojson/master/indonesia-cities.json";


function ZoomableGeoJSON({ data, onEachFeature, geoJsonRef, selectedFeature }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedFeature) {
      const layer = L.geoJSON(selectedFeature);
      const bounds = layer.getBounds();

      const container = map.getContainer();
      const width = container.clientWidth;

      map.fitBounds(bounds, {
        paddingTopLeft: [0, 0],
        paddingBottomRight: [width / 2, 0],
      });
    } else {
      // Reset to national view
      map.setView([-2, 118], 5);
    }
  }, [selectedFeature, map]);

  
  
  return <GeoJSON data={data} onEachFeature={onEachFeature} ref={geoJsonRef} />;
}

export default function IndonesiaMap() {
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef();
  const [selectedGeoFeature, setSelectedGeoFeature] = useState(null);
  const [cityGeoData, setCityGeoData] = useState(null);
  const [filteredCityGeoData, setFilteredCityGeoData] = useState(null);


  const fetchGeoData = async () => {
    const response = await fetch(INDONESIA_GEOJSON_URL);
    const data = await response.json();
    setGeoData(data);
  };

  const fetchCityGeoData = async () => {
    const response = await fetch(CITY_GEOJSON_URL);
    const data = await response.json();
    setCityGeoData(data);
  };

  const handleProvinceClick = (feature, layer) => {
    const provinceName = feature.properties.propinsi;

    setSelectedProvinces((prev) => {
      const updated =
        prev.includes(provinceName)
          ? prev.filter((name) => name !== provinceName)
          : prev.length < 2
          ? [...prev, provinceName]
          : [prev[1], provinceName];
      return updated;
    });

    setSelectedGeoFeature(feature); // 👈 save the whole GeoJSON feature
    
    layer.setStyle({
      fillColor: "#fde047",
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

    // Style for the provinces
    layer.setStyle({
      color: "#444", // Border color
      fillColor: selectedProvinces.includes(provinceName) ? "#fde047" : "#60a5fa", // Color when selected
      fillOpacity: 0.7,
      weight: 1,
    });
  };

  useEffect(() => {
    fetchGeoData();
    fetchCityGeoData();
  }, []);
  
  useEffect(() => {
    if (selectedGeoFeature && cityGeoData) {
      const provinceName = selectedGeoFeature.properties.propinsi;

      const filteredFeatures = cityGeoData.features.filter(
        (feature) => feature.properties.province_name === provinceName
      );

      setFilteredCityGeoData({
        type: "FeatureCollection",
        features: filteredFeatures,
      });
    } else {
      setFilteredCityGeoData(null);
    }
  }, [selectedGeoFeature, cityGeoData]);
  return (
    <div className={`flex h-screen bg-black text-white ${selectedGeoFeature ? "flex-row" : ""}`}>
      {/* Map section: full width when no province is selected, half width when selected */}
      <div className={`${selectedGeoFeature ? "w-1/2 relative" : "w-full"} h-full transition-all duration-500`}>
        <MapContainer
          center={[-2, 118]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          attributionControl={false}
        >
          {geoData && (
            <ZoomableGeoJSON
              data={geoData}
              onEachFeature={onEachProvince}
              geoJsonRef={geoJsonRef}
              selectedFeature={selectedGeoFeature}
            />
          )}
        </MapContainer>
      </div>

      {/* Right half: province info, only visible when a province is selected */}
      {selectedGeoFeature && (
        <div className="w-1/2 h-full p-6 overflow-auto bg-gray-900 relative transition-all duration-500">
          <button
            onClick={() => {
              setSelectedGeoFeature(null);
              setSelectedProvinces([]);
              setFilteredCityGeoData(null);
            }}
            className="absolute top-4 right-4 text-white text-xl font-bold hover:text-red-400"
            title="Close"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">Selected Provinces:</h2>
          <ul className="list-disc list-inside">
            {selectedProvinces.map((province, index) => (
              <li key={index}>{province}</li>
            ))}
          </ul>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Province Data:</h3>
            <pre className="bg-gray-800 p-4 rounded">
              {JSON.stringify(selectedGeoFeature.properties, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

}