import { useEffect } from "react"
import { useMap } from "./mapProvider"

const export


export const useTimePredict = () => {
  const { map, lngLat, pathRow} = useMap()


  useEffect(() => {
    if (!map) return



  }, [map, lngLat])
}
