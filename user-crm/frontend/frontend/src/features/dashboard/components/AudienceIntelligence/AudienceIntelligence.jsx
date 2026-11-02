import { useMemo, useState } from "react";
import "./AudienceIntelligence.css";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const INDIA_GEO_URL =
  "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

const mapMetrics = [
  { id: "viewers", label: "Active viewers" },
  { id: "subscribers", label: "Subscribers" },
  { id: "watchHours", label: "Watch hours" },
  { id: "revenue", label: "Revenue" },
  { id: "adImpressions", label: "Ad impressions" },
];

const regionalData = {
  "Andhra Pradesh": {
    viewers: "52K", subscribers: "148K", watchHours: "104K",
    revenue: "₹29L", adImpressions: "820K",
    genre: "Action", language: "Telugu",
    mapValues: { viewers: 52, subscribers: 148, watchHours: 104, revenue: 29, adImpressions: 0.82 },
  },
  "Arunachal Pradesh": {
    viewers: "8K", subscribers: "22K", watchHours: "16K",
    revenue: "₹4L", adImpressions: "120K",
    genre: "Adventure", language: "Hindi",
    mapValues: { viewers: 8, subscribers: 22, watchHours: 16, revenue: 4, adImpressions: 0.12 },
  },
  Assam: {
    viewers: "32K", subscribers: "91K", watchHours: "64K",
    revenue: "₹17L", adImpressions: "510K",
    genre: "Drama", language: "Assamese",
    mapValues: { viewers: 32, subscribers: 91, watchHours: 64, revenue: 17, adImpressions: 0.51 },
  },
  Bihar: {
    viewers: "43K", subscribers: "122K", watchHours: "86K",
    revenue: "₹24L", adImpressions: "680K",
    genre: "Drama", language: "Hindi",
    mapValues: { viewers: 43, subscribers: 122, watchHours: 86, revenue: 24, adImpressions: 0.68 },
  },
  Chhattisgarh: {
    viewers: "26K", subscribers: "74K", watchHours: "52K",
    revenue: "₹14L", adImpressions: "390K",
    genre: "Action", language: "Hindi",
    mapValues: { viewers: 26, subscribers: 74, watchHours: 52, revenue: 14, adImpressions: 0.39 },
  },
  Goa: {
    viewers: "14K", subscribers: "39K", watchHours: "28K",
    revenue: "₹9L", adImpressions: "210K",
    genre: "Comedy", language: "Konkani",
    mapValues: { viewers: 14, subscribers: 39, watchHours: 28, revenue: 9, adImpressions: 0.21 },
  },
  Gujarat: {
    viewers: "58K", subscribers: "162K", watchHours: "116K",
    revenue: "₹32L", adImpressions: "980K",
    genre: "Comedy", language: "Gujarati",
    mapValues: { viewers: 58, subscribers: 162, watchHours: 116, revenue: 32, adImpressions: 0.98 },
  },
  Haryana: {
    viewers: "38K", subscribers: "108K", watchHours: "76K",
    revenue: "₹21L", adImpressions: "570K",
    genre: "Action", language: "Hindi",
    mapValues: { viewers: 38, subscribers: 108, watchHours: 76, revenue: 21, adImpressions: 0.57 },
  },
  "Himachal Pradesh": {
    viewers: "18K", subscribers: "51K", watchHours: "36K",
    revenue: "₹11L", adImpressions: "270K",
    genre: "Adventure", language: "Hindi",
    mapValues: { viewers: 18, subscribers: 51, watchHours: 36, revenue: 11, adImpressions: 0.27 },
  },
  Jharkhand: {
    viewers: "29K", subscribers: "82K", watchHours: "58K",
    revenue: "₹16L", adImpressions: "430K",
    genre: "Drama", language: "Hindi",
    mapValues: { viewers: 29, subscribers: 82, watchHours: 58, revenue: 16, adImpressions: 0.43 },
  },
  Karnataka: {
    viewers: "96K", subscribers: "276K", watchHours: "192K",
    revenue: "₹54L", adImpressions: "1.8M",
    genre: "Crime", language: "Kannada",
    mapValues: { viewers: 96, subscribers: 276, watchHours: 192, revenue: 54, adImpressions: 1.8 },
  },
  Kerala: {
    viewers: "61K", subscribers: "173K", watchHours: "128K",
    revenue: "₹36L", adImpressions: "1.1M",
    genre: "Drama", language: "Malayalam",
    mapValues: { viewers: 61, subscribers: 173, watchHours: 128, revenue: 36, adImpressions: 1.1 },
  },
  "Madhya Pradesh": {
    viewers: "47K", subscribers: "134K", watchHours: "94K",
    revenue: "₹26L", adImpressions: "710K",
    genre: "Action", language: "Hindi",
    mapValues: { viewers: 47, subscribers: 134, watchHours: 94, revenue: 26, adImpressions: 0.71 },
  },
  Maharashtra: {
    viewers: "142K", subscribers: "382K", watchHours: "286K",
    revenue: "₹82L", adImpressions: "2.8M",
    genre: "Drama", language: "Hindi / Marathi",
    mapValues: { viewers: 142, subscribers: 382, watchHours: 286, revenue: 82, adImpressions: 2.8 },
  },
  Manipur: {
    viewers: "11K", subscribers: "31K", watchHours: "22K",
    revenue: "₹6L", adImpressions: "160K",
    genre: "Drama", language: "Manipuri",
    mapValues: { viewers: 11, subscribers: 31, watchHours: 22, revenue: 6, adImpressions: 0.16 },
  },
  Meghalaya: {
    viewers: "12K", subscribers: "34K", watchHours: "24K",
    revenue: "₹7L", adImpressions: "180K",
    genre: "Music", language: "Khasi",
    mapValues: { viewers: 12, subscribers: 34, watchHours: 24, revenue: 7, adImpressions: 0.18 },
  },
  Mizoram: {
    viewers: "7K", subscribers: "20K", watchHours: "14K",
    revenue: "₹4L", adImpressions: "100K",
    genre: "Drama", language: "Mizo",
    mapValues: { viewers: 7, subscribers: 20, watchHours: 14, revenue: 4, adImpressions: 0.1 },
  },
  Nagaland: {
    viewers: "9K", subscribers: "25K", watchHours: "18K",
    revenue: "₹5L", adImpressions: "130K",
    genre: "Adventure", language: "English",
    mapValues: { viewers: 9, subscribers: 25, watchHours: 18, revenue: 5, adImpressions: 0.13 },
  },
  Odisha: {
    viewers: "35K", subscribers: "99K", watchHours: "70K",
    revenue: "₹19L", adImpressions: "550K",
    genre: "Drama", language: "Odia",
    mapValues: { viewers: 35, subscribers: 99, watchHours: 70, revenue: 19, adImpressions: 0.55 },
  },
  Punjab: {
    viewers: "41K", subscribers: "116K", watchHours: "82K",
    revenue: "₹23L", adImpressions: "620K",
    genre: "Comedy", language: "Punjabi",
    mapValues: { viewers: 41, subscribers: 116, watchHours: 82, revenue: 23, adImpressions: 0.62 },
  },
  Rajasthan: {
    viewers: "48K", subscribers: "139K", watchHours: "96K",
    revenue: "₹27L", adImpressions: "840K",
    genre: "Action", language: "Hindi",
    mapValues: { viewers: 48, subscribers: 139, watchHours: 96, revenue: 27, adImpressions: 0.84 },
  },
  Sikkim: {
    viewers: "6K", subscribers: "17K", watchHours: "12K",
    revenue: "₹3L", adImpressions: "80K",
    genre: "Adventure", language: "Nepali",
    mapValues: { viewers: 6, subscribers: 17, watchHours: 12, revenue: 3, adImpressions: 0.08 },
  },
  "Tamil Nadu": {
    viewers: "118K", subscribers: "314K", watchHours: "241K",
    revenue: "₹68L", adImpressions: "2.2M",
    genre: "Thriller", language: "Tamil",
    mapValues: { viewers: 118, subscribers: 314, watchHours: 241, revenue: 68, adImpressions: 2.2 },
  },
  Telangana: {
    viewers: "69K", subscribers: "184K", watchHours: "139K",
    revenue: "₹39L", adImpressions: "1.2M",
    genre: "Action", language: "Telugu",
    mapValues: { viewers: 69, subscribers: 184, watchHours: 139, revenue: 39, adImpressions: 1.2 },
  },
  Tripura: {
    viewers: "10K", subscribers: "28K", watchHours: "20K",
    revenue: "₹5L", adImpressions: "140K",
    genre: "Drama", language: "Bengali",
    mapValues: { viewers: 10, subscribers: 28, watchHours: 20, revenue: 5, adImpressions: 0.14 },
  },
  "Uttar Pradesh": {
    viewers: "88K", subscribers: "251K", watchHours: "176K",
    revenue: "₹49L", adImpressions: "1.6M",
    genre: "Drama", language: "Hindi",
    mapValues: { viewers: 88, subscribers: 251, watchHours: 176, revenue: 49, adImpressions: 1.6 },
  },
  Uttarakhand: {
    viewers: "23K", subscribers: "65K", watchHours: "46K",
    revenue: "₹13L", adImpressions: "330K",
    genre: "Adventure", language: "Hindi",
    mapValues: { viewers: 23, subscribers: 65, watchHours: 46, revenue: 13, adImpressions: 0.33 },
  },
  "West Bengal": {
    viewers: "54K", subscribers: "151K", watchHours: "108K",
    revenue: "₹30L", adImpressions: "920K",
    genre: "Drama", language: "Bengali",
    mapValues: { viewers: 54, subscribers: 151, watchHours: 108, revenue: 30, adImpressions: 0.92 },
  },

  "Andaman and Nicobar Islands": {
    viewers: "4K", subscribers: "11K", watchHours: "8K",
    revenue: "₹2L", adImpressions: "50K",
    genre: "Adventure", language: "Hindi",
    mapValues: { viewers: 4, subscribers: 11, watchHours: 8, revenue: 2, adImpressions: 0.05 },
  },
  Chandigarh: {
    viewers: "15K", subscribers: "42K", watchHours: "30K",
    revenue: "₹8L", adImpressions: "220K",
    genre: "Comedy", language: "Hindi",
    mapValues: { viewers: 15, subscribers: 42, watchHours: 30, revenue: 8, adImpressions: 0.22 },
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    viewers: "5K", subscribers: "14K", watchHours: "10K",
    revenue: "₹3L", adImpressions: "70K",
    genre: "Drama", language: "Gujarati",
    mapValues: { viewers: 5, subscribers: 14, watchHours: 10, revenue: 3, adImpressions: 0.07 },
  },
  Delhi: {
    viewers: "76K", subscribers: "198K", watchHours: "151K",
    revenue: "₹46L", adImpressions: "1.4M",
    genre: "Thriller", language: "Hindi",
    mapValues: { viewers: 76, subscribers: 198, watchHours: 151, revenue: 46, adImpressions: 1.4 },
  },
  "Jammu and Kashmir": {
    viewers: "21K", subscribers: "59K", watchHours: "42K",
    revenue: "₹12L", adImpressions: "310K",
    genre: "Adventure", language: "Urdu / Hindi",
    mapValues: { viewers: 21, subscribers: 59, watchHours: 42, revenue: 12, adImpressions: 0.31 },
  },
  Ladakh: {
    viewers: "3K", subscribers: "9K", watchHours: "6K",
    revenue: "₹2L", adImpressions: "40K",
    genre: "Documentary", language: "Hindi",
    mapValues: { viewers: 3, subscribers: 9, watchHours: 6, revenue: 2, adImpressions: 0.04 },
  },
  Lakshadweep: {
    viewers: "2K", subscribers: "6K", watchHours: "4K",
    revenue: "₹1L", adImpressions: "25K",
    genre: "Documentary", language: "Malayalam",
    mapValues: { viewers: 2, subscribers: 6, watchHours: 4, revenue: 1, adImpressions: 0.025 },
  },
  Puducherry: {
    viewers: "8K", subscribers: "23K", watchHours: "16K",
    revenue: "₹4L", adImpressions: "110K",
    genre: "Drama", language: "Tamil",
    mapValues: { viewers: 8, subscribers: 23, watchHours: 16, revenue: 4, adImpressions: 0.11 },
  },
};

const fallbackRegion = {
  viewers: "—",
  subscribers: "—",
  watchHours: "—",
  revenue: "—",
  adImpressions: "—",
  genre: "Not available",
  language: "Not available",
};

const STATE_ALIASES = {
  "NCT of Delhi": "Delhi",
  "National Capital Territory of Delhi": "Delhi",
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
  "Jammu & Kashmir": "Jammu and Kashmir",
  "Dadra and Nagar Haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "Daman and Diu": "Dadra and Nagar Haveli and Daman and Diu",
};

function normalizeStateName(value = "") {
  const name = String(value).trim();
  return STATE_ALIASES[name] || name;
}

function normalizeMapKey(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

const STATE_COLOR_SCALE = [
  "#59421F",
  "#80602C",
  "#A77D39",
  "#C49A50",
  "#E0B968",
  "#F2D58D",
];

function getFill(geography, metric) {
  const properties = geography.properties || {};

  const stateName =
    properties.NAME_1 ||
    properties.st_nm ||
    properties.name ||
    properties.NAME ||
    properties.ST_NM ||
    properties.state_name ||
    properties.NAME_2 ||
    "";

  const normalizedName = normalizeMapKey(
    normalizeStateName(stateName)
  );

  const matchedEntry = Object.entries(regionalData).find(
    ([name]) => normalizeMapKey(name) === normalizedName
  );

  if (!matchedEntry) return "#292929";

  const [, stateData] = matchedEntry;
  const value = Number(stateData.mapValues?.[metric]);

  if (!Number.isFinite(value)) return "#292929";

  const values = Object.values(regionalData)
    .map((item) => Number(item.mapValues?.[metric]))
    .filter(Number.isFinite);

  const min = Math.min(...values);
  const max = Math.max(...values);

  const ratio = max === min ? 0.5 : (value - min) / (max - min);

  const index = Math.min(
    STATE_COLOR_SCALE.length - 1,
    Math.floor(ratio * STATE_COLOR_SCALE.length)
  );

  return STATE_COLOR_SCALE[index];
}

export default function AudienceIntelligence() {
  const [metric, setMetric] = useState("viewers");
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [geoError, setGeoError] = useState(false);

  const selectedData = useMemo(
    () => regionalData[selectedState] || fallbackRegion,
    [selectedState]
  );

  return (
    <div className="sa-audience-layout">
      <div className="sa-map-panel">
        <div className="sa-map-toolbar">
          <div>
            <h4>Audience distribution across India</h4>
            <p>Select a state to inspect regional performance.</p>
          </div>

          <label className="sa-map-filter">
            <span>Map layer</span>
            <select
              value={metric}
              onChange={(event) => setMetric(event.target.value)}
            >
              {mapMetrics.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="sa-india-map">
          {geoError ? (
            <div className="sa-map-fallback">
              <strong>Map boundaries could not be loaded.</strong>
              <span>
                Check your internet connection or host the GeoJSON locally
                for production.
              </span>
            </div>
          ) : (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [82.8, 22.8], scale: 900 }}
              width={720}
              height={520}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "440px",
              }}
            >
              <ZoomableGroup center={[82.8, 22.8]} zoom={1}>
                <Geographies
                  geography={INDIA_GEO_URL}
                  onError={() => setGeoError(true)}
                >
                  {({ geographies }) =>
                    geographies.map((geography) => {
                      const name = normalizeStateName(
                        geography.properties?.NAME_1 ||
                        geography.properties?.st_nm ||
                        geography.properties?.name ||
                        geography.properties?.NAME ||
                        "Unknown"
                      );

                      const active = name === selectedState;

                      return (
                        <Geography
                          key={geography.rsmKey}
                          geography={geography}
                          onClick={() => setSelectedState(name)}
                          style={{
                            default: {
                              fill: getFill(geography, metric),
                              stroke: "#171717",
                              strokeWidth: 1,
                              outline: "none",
                            },
                            hover: {
                              fill: "#F2D58D",
                              stroke: "#FFF0C2",
                              strokeWidth: 1.5,
                            },
                            pressed: {
                              fill: "#F8E5B5",
                              stroke: "#FFF0C2",
                              strokeWidth: 1.5,
                            },

                          }}
                          tabIndex={0}
                          aria-label={name}
                          className={active ? "sa-map-state-active" : ""}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          )}
        </div>

        <div className="sa-map-legend">
          <span>Lower</span>
          <div
            className="sa-map-gradient"
            aria-label="Lower to higher audience intensity"
          />
          <span>Higher</span>
          <small>Regional intensity based on the selected metric.</small>
        </div>
      </div>

      <aside className="sa-state-detail">
        <div className="sa-state-detail-top">
          <div>
            <span className="sa-detail-eyebrow">SELECTED REGION</span>
            <h4>{selectedState}</h4>
          </div>
          <span className="sa-state-pin">IND</span>
        </div>

        <div className="sa-state-metrics">
          <div>
            <span>Active viewers</span>
            <strong>{selectedData.viewers}</strong>
          </div>
          <div>
            <span>Subscribers</span>
            <strong>{selectedData.subscribers}</strong>
          </div>
          <div>
            <span>Watch hours</span>
            <strong>{selectedData.watchHours}</strong>
          </div>
          <div>
            <span>Revenue</span>
            <strong>{selectedData.revenue}</strong>
          </div>
          <div>
            <span>Ad impressions</span>
            <strong>{selectedData.adImpressions}</strong>
          </div>
        </div>

        <div className="sa-state-content">
          <span>Popular genre</span>
          <strong>{selectedData.genre}</strong>
          <span>Leading language</span>
          <strong>{selectedData.language}</strong>
        </div>
      </aside>
    </div>
  );
}