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

export default function IndonesiaMap({ onProvinceStats }) {
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef();
  const [selectedGeoFeature, setSelectedGeoFeature] = useState(null);
  const [cityGeoData, setCityGeoData] = useState(null);
  const [filteredCityGeoData, setFilteredCityGeoData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);  // <-- State for Gemini response

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

  const handleProvinceClick = async (feature, layer) => {
    const provinceName = feature.properties.state;
    console.log('Province clicked:', provinceName); // Debug log

    setSelectedProvinces((prev) => {
      const updated =
        prev.includes(provinceName)
          ? prev.filter((name) => name !== provinceName)
          : prev.length < 2
          ? [...prev, provinceName]
          : [prev[1], provinceName];
      return updated;
    });

    setSelectedLayer(layer);
    setSelectedGeoFeature(feature);

    // Highlight the province with a new color
    layer.setStyle({
      fillColor: "#fde047",
      color: "#facc15",
      weight: 2,
      fillOpacity: 0.9,
    });

    try {
      // Call Gemini analysis API
      const analysisResponse = await fetch("/api/MapHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provinceData: feature.properties }),
      });
      const analysisData = await analysisResponse.json();
      setGeminiAnalysis(analysisData.result);

      // setup the province stats
      onProvinceStats({
        areaName: provinceName,
        areaCommodity: analysisData.result.commodities,
      });

    } catch (error) {
      console.error("Error calling APIs:", error);
    }
  };


  const onEachProvince = (feature, layer) => {
    const provinceName = feature.properties.state;

    layer.on({
      click: () => handleProvinceClick(feature, layer),
    });

    // Style for the provinces
    layer.setStyle({
      color: "#444", // Border color
      fillColor: selectedProvinces.includes(provinceName) ? "#fde047" : "#60a5fa", // Default color is #60a5fa
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
      const provinceName = selectedGeoFeature.properties.state;

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
      {/* Map section */}
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

      {/* Right half: province info */}
      {selectedGeoFeature && (
        <div className="w-1/2 h-full p-6 overflow-auto bg-gray-900 relative transition-all duration-500">
          <button
            onClick={() => {
              if (selectedLayer && geoJsonRef.current) {
                selectedLayer.setStyle({
                  fillColor: "#60a5fa", // Reset to default color
                  color: "#444", // Border color
                  fillOpacity: 0.7,
                  weight: 1,
                });
              }

              setSelectedGeoFeature(null);
              setSelectedLayer(null);
              setSelectedProvinces([]);
              setFilteredCityGeoData(null);
              setGeminiAnalysis(null); // Optional: clear result when closing
            }}
            className="absolute top-4 right-4 text-white text-xl font-bold hover:text-red-400"
            title="Close"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4">Selected Province:</h2>
          {/* <ul className="list-disc list-inside">
            {selectedProvinces.map((province, index) => (
              <li key={index}>{province}</li>
            ))}
          </ul> */}

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Province :</h3>
            <pre className="bg-gray-800 p-4 rounded">
              <span>
               {selectedGeoFeature.properties.state || "N/A"}
              </span>
            </pre>
          </div>

          {geminiAnalysis && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Analysis</h3>

              <div className="space-y-4">
                <div>
                  <span className="font-semibold ml-4 text-lg">Area Name: </span>{" "}
                  <span className="text-lg">
                    {selectedGeoFeature?.properties?.state || "N/A"}
                  </span>
                </div>

                {/* Commodities Section */}
                <div>
                  <span className="font-bold ml-4 text-lg">Major Commodities & Price Fluctuations:</span>
                  <ul className="list-disc list-inside ml-8 mt-1 text-lg">
                    {geminiAnalysis.commodities
                      ? Object.entries(geminiAnalysis.commodities).map(([commodity, fluctuation], idx) => (
                          <li key={idx}>
                            {commodity}: {fluctuation}
                          </li>
                        ))
                      : <li>Not available</li>}
                  </ul>
                </div>

                {/* Supply Condition */}
                <div>
                  <span className="font-bold ml-4 text-lg">Supply Condition:</span>{" "}
                  <span className="text-lg">
                    {geminiAnalysis.supply_condition || "Not available"}
                  </span>
                </div>

                {/* Investment Recommendation */}
                <div>
                  <span className="font-bold ml-4 text-lg">Investment Recommendation:</span>
                  <ul className="list-disc list-inside ml-8 mt-1 text-lg">
                    {Array.isArray(geminiAnalysis.investment_recommendation)
                      ? geminiAnalysis.investment_recommendation.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))
                      : <li>Not available</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
