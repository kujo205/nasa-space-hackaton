"use client";

import {
  LngLat,
  Map,
  NavigationControl,
  MapMouseEvent,
  Marker,
  GeolocateControl,
} from "mapbox-gl";
import {
  createContext,
  FC, MutableRefObject,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo, useRef,
  useState,
} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { LandSatBoundaries } from "./source";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const mapContainerId = "map";

interface MapContextI {
  map: Map | null;
  lngLat: LngLat;
  setLngLat: (lngLat: Partial<LngLat>) => void;
  mapContainerId: string;
  pathRow: MutableRefObject<{
    path: number;
    row: number;
  } | null>
}

// @ts-expect-error: MapContextI is empty
const MapContext = createContext<MapContextI>({});

export const useMap = () => useContext(MapContext);

export const MapProvider: FC<PropsWithChildren> = ({ children }) => {
  const [map, setMap] = useState<Map | null>(null);
  const [lngLat, setLngLat] = useState<LngLat>(
    new LngLat(50.4015678, 30.2023581),
  );
  const pathRow = useRef<{ path: number, row: number } | null>(null)

  useEffect(() => {
    const map = new Map({
      container: mapContainerId,
      accessToken,
      center: lngLat,
      zoom: 3,
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/standard",
      minZoom: 0,
      maxZoom: 24,
      attributionControl: false,
    });

    map.addControl(new NavigationControl());
    map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        fitBoundsOptions: {
          zoom: 3,
        },
      }).on("geolocate", (e) => {
        // @ts-expect-error: types
        setLngLat({
          lng: e.coords.longitude,
          lat: e.coords.latitude,
        });
      }),
    );

    map.on("load", () => {
      const { source: boundariesSource, layers, id } = LandSatBoundaries;
      map.addSource(id, boundariesSource);
      layers.forEach((layer) => {
        map.addLayer(layer);
      });

      setMap(map);
    });
  }, []);

  useEffect(() => {
    if (!map) return;

    const clickHandler = (event: MapMouseEvent) => {
      setLngLat(event.lngLat);
    };

    map.on("click", clickHandler);
    return () => {
      map.off("click", clickHandler);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const boundaries = (event: MapMouseEvent) => {
      const feature = event.features?.at(0)
      if (!feature) return
      const description = feature.properties?.description

      const pathMatch = description.match(/<strong>PATH<\/strong>:\s*(\d+(\.\d+)?)/);
      const rowMatch = description.match(/<strong>ROW<\/strong>:\s*(\d+(\.\d+)?)/);

      const path = pathMatch ? parseInt(pathMatch[1]) : null;
      const row = rowMatch ? parseInt(rowMatch[1]) : null;

      if (path && row) {
        pathRow.current = { path, row }
      }
    }

    map.on("click", ["boundaries"], boundaries);

    return () => {
      map.off("click", ["boundaries"], boundaries);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !lngLat) return;

    const markerElement = document.createElement("div");
    markerElement.innerHTML = `<img src="/marker.svg" style="width: 50px; height: 50px; transform: translateY(-50%);" />`;

    const marker = new Marker(markerElement).setLngLat(lngLat).addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, lngLat]);

  if (!lngLat) return null;

  return (
    // @ts-expect-error: types fuck around
    <MapContext.Provider value={{ map, lngLat, setLngLat, mapContainerId }}>
      {children}
    </MapContext.Provider>
  );
};
