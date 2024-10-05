import { GeoJSONSourceSpecification, LayerSpecification } from "mapbox-gl";

const id = "boundaries";

const source: GeoJSONSourceSpecification = {
  type: "geojson",
  data: `/data/WRS-2_bound_world_0.geojson`,
};

const layers: LayerSpecification[] = [
  {
    id: "boundaries",
    type: "fill",
    source: "boundaries",
    paint: {
      "fill-color": "#6d28d9",
      "fill-opacity": 0.3,
    },
  },
];

export const LandSatBoundaries = { source, layers, id };
