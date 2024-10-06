import { useEffect } from "react";
import { useMap } from "./mapProvider";

export const useTimePredict = () => {
  const { map, lngLat, pathRow } = useMap();

  useEffect(() => {
    if (!map) return;
  }, [map, lngLat]);
};
