import Form from "../components/Form";
import { MapProvider } from "./maps/mapProvider";

export default function Home() {
  return (
    <MapProvider>
      <Form />
    </MapProvider>
  );
}
